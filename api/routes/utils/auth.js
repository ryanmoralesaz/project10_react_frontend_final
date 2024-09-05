// require the bcrypt package
const bcrypt = require('bcryptjs');
// require the User class from models
const { User } = require('../../models');
// require the basic-auth package
const auth = require('basic-auth');

// create a user authentication middle ware
const authenticateUser = async (req, res, next) => {
  // let message = null;
  // extract the user credentials from the authorization header
  const credentials = auth(req);

  // early return for missing credentials
  // if credentials aren't found, return a 401 with an access denied message
  if (!credentials) {
    // console.log("No credentials extracted from authorization header");
    // message = 'Authorization header not fonud';
    // console.warn(message);
    return res.status(401).json({ errors: ['Access Denied. Email and Password are required'] });
  }
  if (!credentials.name || !credentials.pass) {
    return res.status(401).json({ errors: ['Email and password are required'] });
  }
  // find the user in the database by the provided email
  const user = await User.findOne({
    where: { emailAddress: credentials.name }
  });

  // early return for user not found
  // if the user is not found send a 401 with an access denied message
  if (!user) {
    return res.status(401).json({ errors: ['User not found. Please check your credentials.'] });
  }

  // test if the found users hashed password is the same as the provided password
  const authenticated = bcrypt.compareSync(credentials.pass, user.password);
  // early return for failed authentication
  // return 401 message if the authentication failed
  if (!authenticated) {
    return res.status(401).json({ errors: ['Incorrect password'] });
  }
  // if all checks pass set the user on the request object and go to next middle ware route
  req.currentUser = user;
  next();
};

module.exports = authenticateUser;
