'use strict';

const express = require('express');
// import the Course and User class from models
const { Course, User } = require('../models');
// import the authenticateUser middleware function
const authenticateUser = require('./utils/auth.js');
const errorHandler = require('./utils/errorHandler.js');
// utilize express Router
const router = express.Router();

// GET /api/courses get a list of all of the user's courses
router.get('/courses', async (req, res, next) => {
  try {
    // throw new Error(500);
    // use a promise to find all of the user courses but exclude some attributes
    // initialize the courses 
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'] // exclude the createdAt, updatedAt, and password fields
        }
      ],
      attributes: [
        'id',
        'title',
        'description',
        'estimatedTime',
        'materialsNeeded'
      ] // exclude createdAt, and updatedAt fields
    });
    // early return if no courses are found return a resource not found message
    if (courses.length === 0) {
      const error = new Error('No courses found');
      error.status = 404;
      throw error;
    }
    // if the course/s are found return the json of courses with a successful response
    res.status(200).json(courses);
  } catch (error) {
    // if there is a server lookup problem return a standard server error message
    next(error);
  }
});

// GET /api/courses/:id
// We're going to return the corresponding requested course by id including the User association
router.get(`/courses/:id`, async (req, res, next) => {
  try {
    // throw new Error(500);
    // find the course be the primary key
    // include the User info excluding some fields
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'] // exclude the createAd, updatedAt, and password fields
        }
      ],
      attributes: [
        'id',
        'title',
        'description',
        'estimatedTime',
        'materialsNeeded'
      ] // exclude the created at and updatedAt fields
    });
    // early return if the specified course does not exist
    if (!course) {

      const error = new Error('Course was not found');
      error.status = 404;
      throw error;
    }
    // return the json of the course with a successful message
    res.status(200).json(course);
  } catch (error) {
    // return a standard server error message if there was a problem
    next(error);
  }
});

// POST /api/courses
// create a new course if the user is authenticated
router.post('/courses', authenticateUser, async (req, res, next) => {
  try {
    // throw new Error(500);
    // initialize the body of the request to the course variable
    // const course = req.body;
    // Associate the coures with the authenticated user
    // course.userId = req.currentUser.id;
    // asynchronously wait for the course to be created with the sequelize create() method
    // assign it to a new course variable and interpolate it in the response location header
    const newCourse = await Course.create({
      ...req.body,
      userId: req.currentUser.id
    });
    // console.log('new course created', newCourse.toJSON());
    const locationHeader = `/api/courses/${newCourse.id}`;
    // return a resource created status and a location header of the new resource
    // console.log('Setting Location header:', locationHeader);

    res.status(201).location(locationHeader).json({
      success: true,
      message: 'Course created successfully',
      courseId: newCourse.id
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/courses/:id
// We're going to update the corresponding course that matches the id parameter
// if the user is authenticated
router.put('/courses/:id', authenticateUser, async (req, res, next) => {
  try {
    // throw new Error(500);
    // initialize the requested course to the course const by its primary key that matches the params id
    const course = await Course.findByPk(req.params.id);
    // early return if the course isn't found
    if (!course) {
      // send a resource not found message
      const error = new Error('Course was not found');
      error.status = 404;
      throw error;
    }
    // compare the course user id to the authenticated user id
    if (course.userId !== req.currentUser.id) {
      const error = new Error('Access Denied. User is not owner of requested course.');
      error.status = 403;
      throw error;
    }
    // update the course
    await course.update(req.body);
    // send a no content status code after update
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// DELETE /api/courses/:id
// We're going to delete the courses with the matching params id if the user is the authenticated owner of the course
router.delete(`/courses/:id`, authenticateUser, async (req, res, next) => {
  try {
    // throw new Error(500);
    const course = await Course.findByPk(req.params.id);
    // early return if course not found
    if (!course) {
      const error = new Error('Error deleting the course. Course not found.');
      error.status = 404;
      throw error;
    }
    if (course.userId !== req.currentUser.id) {

      const error = new Error('Access denied: User is not the owner');
      error.status = 403;
      throw error;
    }
    // if the course owner id matches the id of the authenticated user allow the delete request
    // if (course.userId === req.currentUser.id) {
    // delete the course with the sequelize destroy() method
    await course.destroy();
    // return a no content response
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
router.use(errorHandler);
module.exports = router;
