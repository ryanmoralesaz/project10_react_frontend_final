const { User, Course } = require('./models');

async function createTestData() {
  try {
    const user = await User.create({
      firstName: 'Joe',
      lastName: 'Smith',
      emailAddress: 'Joe@test.com',
      password: 'password123'
    });
    const course = await Course.create({
      title: 'Test Course',
      description: 'This is a test course',
      estimatedTime: '1 hour',
      materialsNeeded: 'Computer'
    });

    console.log('User and Course created with association');
  } catch (err) {
    console.error('Error creating data', err);
  }
}

createTestData();
