'use strict';
const { Model } = require('sequelize');
// require bcrypt
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // assign the userID to the User foreign key
      // add a one-to-many association between the User and Course model using the hasMany() method
      // add an as alias to specify the relationship to courses
      User.hasMany(models.Course, {
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        // firstName is required
        allowNull: false,
        // validation message for empty field
        validate: {
          notEmpty: {
            msg: 'First name is a required field'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        // lastName is required
        allowNull: false,
        // validation message for empty field
        validate: {
          notEmpty: {
            msg: 'Last name is a required field'
          }
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        // email is required
        allowNull: false,
        // email must be unique
        unique: {
          msg: 'This email is already in use in the database.'
        },
        // validation message for empty field and formatted as email
        validate: {
          notEmpty: {
            msg: 'eMail is required'
          },
          isEmail: {
            msg: 'Must be a valid email address'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        // password is required
        allowNull: false,
        // validation message for empty field
        validate: {
          notEmpty: {
            msg: 'Password is required'
          }
        }
      },
      confirmedPassword: {
        type: DataTypes.VIRTUAL,
        allowNull: true,
        notNull: {
          msg: 'Both passwords must match'
        },
        validate: {
          isEqual(value) {
            if (value !== this.password) {
              throw new Error('Passwords must match');
            }
          }
        }
      }

    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          // Hash password directly
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    }
  );
  return User;
};
