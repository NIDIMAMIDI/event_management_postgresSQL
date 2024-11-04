import { sequelize } from '../../config/db/db.js';
import { DataTypes } from 'sequelize';

import { User } from '../user/user.models.js';

export const Event = sequelize.define(
  'Event',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // set(value) {
      //   this.setDataValue('title', value.trim());
      // },
      validate: {
        notNull: true,
        notEmpty: true,
        isLowercase: true
      }
    },
    description: {
      type: DataTypes.STRING
      // set(value) {
      //   this.setDataValue('description', value.trim());
      // }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      // set(value) {
      //   this.setDataValue('location', value.trim());
      // },
      validate: {
        notNull: true
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Use the table name as a string
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      validate: {
        notNull: true
      }
    }
  },
  {
    freezeTableName: true
  }
); // Import User model here

Event.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Event, { foreignKey: 'createdBy' }); // User = Event(1:M) Relationship
