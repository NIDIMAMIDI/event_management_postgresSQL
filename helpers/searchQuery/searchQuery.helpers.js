import { Op } from 'sequelize';

export const query = async (title, date, location, capacity) => {
  // Build the query object for search
  const searchQuery = {}; // Initialize the where clause object

  if (title) {
    searchQuery.title = { [Op.iLike]: `%${title}%` }; // Case-insensitive search
  }

  if (date) {
    searchQuery.date = date; // Add date filter
  }

  if (location) {
    searchQuery.location = { [Op.iLike]: `%${location}%` }; // Case-insensitive location search
  }

  if (capacity) {
    searchQuery.capacity = capacity; // Add capacity filter
  }

  return searchQuery;
};
