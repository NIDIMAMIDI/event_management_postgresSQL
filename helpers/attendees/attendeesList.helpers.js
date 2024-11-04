import { Attendee } from '../../models/attendees/attendees.model.js';
import { User } from '../../models/user/user.models.js';

// Function to insert multiple attendees using Sequelize's bulkCreate
export const insertAttendees = async (validAttendees, eventId) => {
  if (validAttendees.length > 0) {
    // Insert multiple attendees using bulkCreate
    await Attendee.bulkCreate(
      validAttendees.map((attendeeId) => ({
        event_id: eventId,
        user_id: attendeeId
      }))
    );
  }
};

// Function to get the list of attendees for a specific event
export const attendeeList = async (eventId) => {
  const attendeesList = await Attendee.findAll({
    where: {
      event_id: eventId
    },
    include: [
      {
        model: User, // Join with User model
        attributes: ['id', 'username'] // Only include the 'username' field from User model
      }
    ]
  });
  // console.log(attendeesList);

  return attendeesList;
};
