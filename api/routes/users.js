'use strict';

const express = require('express');
// require the bcrypt package for the bcrypt hashsync
const bcrypt = require('bcryptjs');
// import the User class from models
const { User } = require('../models');
// import the authentication middleware function from utils
const authenticateUser = require('./utils/auth.js');
// utilize express router
const router = express.Router();

// GET /api/users - get the current user
router.get('/users', authenticateUser, async (req, res, next) => {
// return next(new Error('500 Test Error'));
  // if the users credentials pass the authenticateUser middleware function
  // initialize user to the currentUser that sent the request
  const user = req.currentUser;
  // return a 200 response to the user with a json readout of the accepted credentials
  // filter out the password, createdAt and UpdatedAt for extra credit
  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
});

// POST /api/users - create a new user
router.post('/users', async (req, res, next) => {
  // return next(new Error('500 Test Error'));
  try {
    // destructure the request body specifically looking for the password field, abstract everything else with the rest operator ...
    const { password, ...rest } = req.body;
    // cache a user object with the fields and set the confirmed Passworh to the password for temporary development testing
    const user = {
      ...rest,
      password,
      confirmedPassword: password,
    }
    //create a new user record in the database with the user object
    await User.create(
      user
    );
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    };
    // return a entity created status, send a location '/' header and end the route
    // res.status(201).location('/').end();
    // send the userResponse to the signup context action instead of navigating from here
    res.status(201).json(userResponse);
  } catch (error) {
    // check if any caught errors are validaiton errors or unique constraint errors
    // extra credit problem
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      // use the map higher order function to iterate over the errors and pull out the messages
      const errors = error.errors.map((err) => err.message);
      // return a bad request status and give the user an object of error messages
      res.status(400).json({ errors });
    } else {
      // if not a sequelize error return a standard server error message.
      console.error('There was an error creating the user:', error);
      res.status(500).json({ errors: ['There was an error creating the user'] });
    }
  }
});
router.post('/users/signin', authenticateUser, (req, res, next) => {
// return next(new Error('500 Test Error'));
  const user = req.currentUser;
  console.log("Authenticated user:", user ? user.emailAddress : "None");

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
});
module.exports = router;
