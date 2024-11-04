import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db/db.js';
import { User } from '../user/user.models.js';
import { Event } from '../event/event.model.js';

export const Attendee = sequelize.define('Attendee', {
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// 1:M(User => Attendee)
User.hasMany(Attendee, { foreignKey: 'user_id' });
Attendee.belongsTo(User, { foreignKey: 'user_id' });

// 1:M(Event => Attendee)
Event.hasMany(Attendee, { foreignKey: 'event_id' });
Attendee.belongsTo(Event, { foreignKey: 'event_id' });
