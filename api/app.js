'use strict';

// load required dependencies
const express = require('express');
// load CORS for cross origin sharing with browser
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const usersRouter = require('./routes/users'); // Import the users router
const coursesRouter = require('./routes/courses'); // Import the courses router
// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));
app.use(express.json());
// configure CORS
app.use(cors(
  {
    origin: 'http://localhost:5173', // The domain of the front end
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE', // the allowed methods
    credentials: true, // allow credentials
  }
));
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});
// IIFE to athenticate the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database was successful');
  } catch (error) {
    console.error('Connection to database failed:', error);
  }
})();

// setup a friendly greeting for the root route

app.get('/', (req, res, next) => {
  // return next(new Error('500 Test Error'));
  res.json({
    message: 'Welcome to the REST API project!'
  });
});

app.use('/api', usersRouter); // Use the routers for the /api path
app.use('/api', coursesRouter); // Use the courses router
app.get('/api/test-forbidden', (req, res) => {
  res.status(403).json({
    errors: ['Access denied']
  });
});
// app.get('/api/test-error', (req, res, next) => {
//   console.log('test error route hit');
//   const error = new Error('This is a test 500 eror');
//   error.status = 500;
//   next(error);
// });
// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    errors: ['Route Not Found']
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  console.error(`Global error handler: ${err.stack}`);
  let statusCode = err.status || 500;
  let errors = [err.message || 'Internal Server Error'];
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    errors = err.errors.map(error => error.message);
  }
  res.status(statusCode).json({
    success: false,
    errors: errors
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
});
