'use strict';

// load required dependencies
const express = require('express');
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
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database was successful');
  } catch (error) {
    console.error('Connection to database failed:', error);
  }
})();
app.use(cors(
  {
    origin: 'http://localhost:5173',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true
  }
));

app.use('/api', usersRouter); // Use the routers for the /api path
app.use('/api', coursesRouter); // Use the courses router


// setup a global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler', err);
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  if (err.message === '500') {
    return res.status(500).json({ message: "Error reading users" });
  }
  // Check if the error is a Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({ errors });
  }

  // Handle specific error types
  if (err.status === 401) {
    return res.status(401).json({ message: err.message || 'Access Denied' });
  }

  // Default error handler
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: {}
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
