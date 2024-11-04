/* eslint-disable max-len */
import { sequelize } from '../../config/db/db.js';
import { DataTypes } from 'sequelize';

export const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isLowercase: true,
        isEmail: true,
        notEmpty: true,
        notNull: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).*$/,
          msg: 'Password must be of length above 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
        }
      }
    },
    token: {
      type: DataTypes.STRING
    }
  },
  {
    freezeTableName: true
  }
);
