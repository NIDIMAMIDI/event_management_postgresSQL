/* eslint-disable max-len */
import { User } from '../../models/user/user.models.js';
import { Op } from 'sequelize';

export const checkAttendeesAndCapacity = async (attendees, capacity, res) => {
  let validAttendees = [];
  let adjustedCapacity = capacity;

  if (attendees && attendees.length > 0) {
    // Find valid attendees from the User model
    const validAttendeesList = await User.findAll({
      where: {
        id: {
          [Op.in]: attendees // Using Sequelize's Op.in to match attendees
        }
      }
    });

    // Extract valid attendee IDs
    validAttendees = validAttendeesList.map((user) => user.id);

    // Check if the number of valid attendees exceeds the event capacity
    if (validAttendees.length > capacity) {
      return res.status(400).json({
        status: 'failure',
        message: `Number of valid attendees (${validAttendees.length}) exceeds the event capacity (${capacity})`
      });
    }

    // Adjust the capacity by subtracting the number of valid attendees
    adjustedCapacity = capacity - validAttendees.length;
  }

  return { validAttendees, adjustedCapacity };
};
