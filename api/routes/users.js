'use strict';
const express = require('express');
// import the User class from models
const { User } = require('../models');
// import the authentication middleware function from utils
const authenticateUser = require('./utils/auth.js');
const errorHandler = require('./utils/errorHandler.js');
// utilize express router
const router = express.Router();

// GET /api/users - get the current user
router.get('/users', authenticateUser, async (req, res, next) => {
  try {
    // throw new Error(500);
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
  } catch (error) {
    next(error);
  }
});

// POST /api/users - create a new user
router.post('/users', async (req, res, next) => {
  try {
    // throw new Error(500);
    // destructure the request body specifically looking for the password field, abstract everything else with the rest operator ...
    const { password, ...rest } = req.body;
    // cache a user object with the fields and set the confirmed Passworh to the password for temporary development testing
    const user = await User.create({
      ...rest,
      password,
      confirmedPassword: password,
    })
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    };
    // return a entity created status, send a location '/' header and end the route
    // send the userResponse to the signup context action instead of navigating from here
    res.status(201).location('/').json(userResponse);
  } catch (error) {
    next(error);
    // check if any caught errors are validaiton errors or unique constraint errors
    // extra credit problem
    // if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    //   // use the map higher order function to iterate over the errors and pull out the messages
    //   const errors = error.errors.map((err) => err.message);
    //   // return a bad request status and give the user an object of error messages
    //   res.status(400).json({ errors });
    // } else {
    //   // if not a sequelize error return a standard server error message.
    //   console.error('There was an error creating the user:', error);
    //   res.status(500).json({ errors: ['There was an error creating the user'] });
    // }
  }
});
router.post('/users/signin', authenticateUser, (req, res, next) => {
  try {
    // throw new Error(500);
    const user = req.currentUser;
    console.log("Authenticated user:", user ? user.emailAddress : "None");

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });
  } catch (error) {
    next(error);
  }
});
router.use(errorHandler);
module.exports = router;
