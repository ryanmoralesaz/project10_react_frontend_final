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
    // res.status(500).json({ message: "error reading users" })
  }
});

// POST /api/users - create a new user
router.post('/users', async (req, res, next) => {
  try {
    // throw new Error(500)
    // destructure the request body specifically looking for the password field, abstract everything else with the rest operator ...
    const { password, ...rest } = req.body;
    // cache a user object with the fields and set the confirmed Passworh to the password for temporary development testing
    const user = {
      ...rest,
      password,
      confirmedPassword: password,
    }
    //screate a new user record in the database with the user object
    await User.create(
      user
    );
    // return a entity created status, send a location '/' header and end the route
    res.status(201).location('/').end();
  } catch (error) {
    next(error);
  }
});
module.exports = router;
