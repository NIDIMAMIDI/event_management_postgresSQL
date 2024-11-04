import { convertNames } from '../../helpers/convert/names.convert.helpers.js';
import { User } from '../../models/user/user.models.js';
import { checkAttendeesAndCapacity } from '../../helpers/checkAttendees/attendees.helpers.js';
import {
  attendeeList,
  insertAttendees
} from '../../helpers/attendees/attendeesList.helpers.js';
import { Event } from '../../models/event/event.model.js';

import { query } from '../../helpers/searchQuery/searchQuery.helpers.js';
import { Attendee } from '../../models/attendees/attendees.model.js';

export const createEvent = async (req, res, next) => {
  try {
    // Destructure the validated values
    const { title, description, date, location, capacity, attendees } = req.body;

    const createdBy = req.user.id;

    // Find the user who is creating the event
    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: 'User does not exist'
      });
    }

    // Convert the title to a unique format if needed
    const eventTitle = await convertNames(title);

    // Check if the user has already registered an event with the same title
    const existingEvent = await Event.findOne({
      where: { title: eventTitle, createdBy: user.id }
    });

    if (existingEvent) {
      return res.status(400).json({
        status: 'failure',
        message: 'You have already registered an event with this title'
      });
    }

    // Convert the string date to a JavaScript Date object
    const eventDate = new Date(date);

    // Initialize variables for attendees validation
    const { validAttendees, adjustedCapacity } = await checkAttendeesAndCapacity(
      attendees,
      capacity,
      res
    );

    // Create and save the event
    const newEvent = await Event.create({
      title: eventTitle,
      description,
      date: eventDate, // Use the Date object in the event creation
      location,
      capacity: adjustedCapacity, // Use adjusted capacity if attendees are present
      createdBy: user.id
    });

    // Save valid attendees to the Attendee model
    await insertAttendees(validAttendees, newEvent.id);

    // Retrieve the attendees for the created event
    const attendeesList = await attendeeList(newEvent.id);

    return res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      event: newEvent,
      attendees: attendeesList.map((attendee) => attendee.User) // Only include user details
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while creating the event',
      error: err.message
    });
  }
};

export const allEvents = async (req, res, next) => {
  try {
    // Get query parameters for pagination and search
    const { page = 1, limit = 100, title, date, location, capacity } = req.query;

    // Convert pagination parameters to numbers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const searchQuery = await query(title, date, location, capacity);

    // Find the events with pagination and search using Sequelize
    const events = await Event.findAndCountAll({
      where: searchQuery,
      offset: (pageNumber - 1) * pageSize, // Skip based on the page
      limit: pageSize // Limit the number of results
    });

    // Return the response with pagination and events
    res.status(200).json({
      status: 'success',
      page: pageNumber,
      totalPages: Math.ceil(events.count / pageSize), // Total number of pages
      totalEvents: events.count, // Total number of events
      events: events.rows // List of events
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while fetching events',
      error: err.message
    });
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found'
      });
    }

    const attendees = await attendeeList(event.id);
    // console.log(attendees);
    return res.status(200).json({
      status: 'success',
      event,
      attendees: attendees.map((att) => att.User)
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the event by its ID
    const event = await Event.findByPk(id);

    // If event not found, return 404
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found'
      });
    }

    // Check if the current user is the creator of the event
    const userId = req.user.id;
    if (event.createdBy !== userId) {
      return res.status(403).json({
        status: 'failure',
        message: 'You are not authorized to perform this action'
      });
    }

    // Perform the update operation
    const [updatedRowsCount] = await Event.update(
      {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        capacity: req.body.capacity,
        location: req.body.location
      },
      { where: { id: event.id } }
    );

    // If no rows were updated, send a message
    if (updatedRowsCount === 0) {
      return res.status(400).json({
        status: 'failure',
        message: 'No changes made to the event'
      });
    }

    // Retrieve the updated event
    const updatedEvent = await Event.findByPk(id);

    // Return the updated event in the response
    return res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while updating the event',
      error: err.message
    });
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the event by its ID
    const event = await Event.findByPk(id);

    // If event not found, return 404
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found'
      });
    }

    // Check if the current user is the creator of the event
    const userId = req.user.id;
    if (event.createdBy !== userId) {
      return res.status(403).json({
        status: 'failure',
        message: 'You are not authorized to perform this action'
      });
    }

    // First, delete the attendees associated with the event
    const attendeeDeletion = await Attendee.destroy({ where: { event_id: event.id } });

    // Then, delete the event itself
    const eventDeletion = await Event.destroy({ where: { id: event.id } });

    // If event deletion is successful
    if (eventDeletion) {
      return res.status(200).json({
        status: 'success',
        message: `Event and its ${attendeeDeletion} attendees have been deleted successfully.`
      });
    } else {
      return res.status(500).json({
        status: 'failure',
        message: 'Failed to delete the event.'
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while deleting the event.',
      error: err.message
    });
  }
};

export const registerEvent = async (req, res, next) => {
  try {
    const { id } = req.params; // Event ID from request parameters
    const userId = req.user.id; // User ID from authenticated user

    // Check if the event exists
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found with the provided ID.'
      });
    }

    // Check if the event is already full
    if (event.capacity <= 0) {
      return res.status(400).json({
        status: 'failure',
        message: 'The event has reached its maximum capacity.'
      });
    }

    // Check if the user is already registered for the event
    const existingAttendee = await Attendee.findOne({
      where: {
        event_id: event.id, // Use the correct event ID field
        user_id: userId
      }
    });
    if (existingAttendee) {
      return res.status(400).json({
        status: 'failure',
        message: 'You are already registered for this event.'
      });
    }

    // Register the user as an attendee
    const attendee = await Attendee.create({ event_id: event.id, user_id: userId });

    // Decrease the event capacity by 1 and save
    event.capacity -= 1;
    await event.save();

    return res.status(201).json({
      status: 'success',
      message: 'You have successfully registered for the event.',
      attendee
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while registering for the event.',
      error: err.message
    });
  }
};

export const cancelEventRegister = async (req, res, next) => {
  try {
    const { id } = req.params; // Event ID from request parameters
    const userId = req.user.id; // User ID from authenticated user

    // Check if the event exists
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        status: 'failure',
        message: 'Event not found with the provided ID.'
      });
    }

    // Check if the user is registered for the event
    const attendee = await Attendee.findOne({
      where: { user_id: userId, event_id: event.id } // Use event.id
    });
    if (!attendee) {
      return res.status(404).json({
        status: 'failure',
        message: 'You are not registered for this event.'
      });
    }

    // Delete the attendee entry to cancel registration
    await Attendee.destroy({ where: { user_id: userId, event_id: event.id } });

    // Increment event capacity since the registration is canceled
    event.capacity += 1;
    await event.save();

    return res.status(200).json({
      status: 'success',
      message: 'You have successfully canceled your registration for the event.'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: 'An error occurred while canceling the registration.',
      error: err.message
    });
  }
};
