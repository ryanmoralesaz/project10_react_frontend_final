# project9_RestAPI_TH

Project 9 School administration API using sequelize.

## Steps

1. `npm i`
2. `npm run seed`

- executes this script in package.json `"seed": "cross-env DB_ENABLE_LOGGING=true node './seed'"`
- this creates the fsjstd-restapi.db file and seeds it with the default user and course data

3.  `npm start`
4.  `npm i sequelize`
5.  `npm i --save-dev sequelize-cli`
6.  `run npx sequelize init`

- this creates config/config.json, migrations/, models/index.js, and seeders/

7. Change the config/config.json file to have the 'storage' key with the fsjstd.db and the dialect to 'sqlite'.
8. Utilize an IIFE and the sequelize.authenticate() function to ensure correct database configuration.
9. Use the sequelize cli to generate a User model `npx sequelize model:create --name User --attributes firstName:string,lastName:string,emailAddress:string,password:string`
10. Use the sequelize cli to generate a User model `npx sequelize model:create --name Course --attributes title:string,description:text,estimatedTime:string,materialsNeeded:string`
11. Add a one-to-many association between the User and Course model using the hasMany() method.
12. Add a one-to-one association between the Course and User models using the belongsTo() method.
13. Install the http client extension in VS Code to utilize the tests package.
14. Utilize express.Router()
15. Create the user routes. Handle errors. Test with HTTP client.

- GET the current user if authenticated, return a 200 status
- POST to create a new user, return a 201 status

16. Create the courses routes. Handle errors. Test with HTTP client.

- GET all courses, return a 200 status
- GET a specific course by id, return a 200 status
- POST create a new course if the user is authenticated, return a 201 status
- PUT update a specific course if user is authenticated, return a 204 status
- DELETE a specific course if the user is authenticated, return a 204 status

17. Export the router from users.js and courses.js
18. Import the coursesRouter and usersRouter to app.js
19. Setup validation on the User model

- should have firstName, lastName, emailAddress and password as required fields (allowNull: false), return validation error messages for not empty.

20. setup validation on the Course model

- should have title and description as required fields.

21. Utilize the bcrypt package in the users.js POST route. Use hashSync function on the new user password before creating the new user record.
22. Create the authenticateUser middleware

- make sure user is authenticated with the basic-auth package to parse the authentication headers from the request.

23. Implement authenticateUser on /api/users GET, /api/courses POST, /api/courses/:id PUT, and /api/courses/:id DELETE
24. Extra Credit and unique for email and isEmail for email.
25. Remove password, createdAt, and updatedAt from the returned response to the user on the GET /api/users route
26. Check for SequelizeUniqueConstraintErrors on the /api/users POST route, return 400 error if found
27. Add options to the findAll method in courses routes so attributes of the attached User excludes createdAt, updatedAt, and password fields.
28. Exclude the createdAt, updatedAt fields of the courses attributes.
29. Update /api/courses/:id PUT and /api/courses/:id DELETE to ensure authenticated user is the owner of the course
30. Add a sync.js file and a npm run dev script to drop tables and sync from scratch, then seed the database for development purposes. Added a start script to only run app.js assuming seeding has been done from the command line as stated in the project instructions.
