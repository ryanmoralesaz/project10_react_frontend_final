Let's start by setting up the routes in `App.jsx` and creating the required components. We'll use React Router for the routing and focus on one route at a time.

### Step 1: Install React Router

First, if you haven't installed React Router yet, you can do so with:

```sh
npm install react-router-dom
```

### Step 2: Setup Routes in `App.jsx`

Here's how your `App.jsx` should look with React Router setup:

```jsx
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import CourseCreate from "./components/CourseCreate";
import CourseUpdate from "./components/CourseUpdate";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={CourseList} />
        <Route path="/courses/create" component={CourseCreate} />
        <Route path="/courses/:id/update" component={CourseUpdate} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
      </Switch>
    </Router>
  );
}

export default App;
```

### Step 3: Create the `CourseList` Component

Let's start with the `CourseList` component, which will be your homepage.

Update your `CourseList.jsx` to fetch the courses from the API and render them:

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";

export default function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="wrap main--grid">
      {courses.map((course, index) => (
        <Link to={`/courses/${course.id}`} key={index}>
          <Course href={`courses/${course.id}`} courseTitle={course.title} />
        </Link>
      ))}
      <NewCourse />
    </div>
  );
}
```

### Step 4: Create the `CourseDetail` Component

Now, let's create the `CourseDetail` component to fetch and display the details of a specific course.

Create a new file `CourseDetail.jsx` and use the provided markup to build out the structure of the component:

```jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ActionsBar from "./ActionsBar";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((response) => response.json())
      .then((data) => setCourse(data))
      .catch((error) => console.error("Error fetching course:", error));
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <ActionsBar />
      <div className="wrap">
        <h2 className="course--detail--title">Course</h2>
        <h3 className="course--name">{course.title}</h3>
        <p>
          By {course.User.firstName} {course.User.lastName}
        </p>
        <ReactMarkdown>{course.description}</ReactMarkdown>
        <h4 className="course--detail--title">Estimated Time</h4>
        <p>{course.estimatedTime}</p>
        <h4 className="course--detail--title">Materials Needed</h4>
        <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
      </div>
    </div>
  );
}
```

### Step 5: Update the `CourseCreate` Component

Let's create the `CourseCreate` component to allow the user to create a new course.

Update your `CourseCreate.jsx`:

```jsx
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function CourseCreate() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const course = { title, description, estimatedTime, materialsNeeded };
    const response = await fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    if (response.status === 201) {
      history.push("/");
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  return (
    <>
      {errors.length > 0 && (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="main--flex">
          <div>
            <label htmlFor="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
            />
            <label htmlFor="materialsNeeded">Materials Needed</label>
            <textarea
              id="materialsNeeded"
              name="materialsNeeded"
              value={materialsNeeded}
              onChange={(e) => setMaterialsNeeded(e.target.value)}
            ></textarea>
          </div>
        </div>
        <button className="button" type="submit">
          Create Course
        </button>
        <button
          className="button button-secondary"
          onClick={(event) => {
            event.preventDefault();
            history.push("/");
          }}
        >
          Cancel
        </button>
      </form>
    </>
  );
}
```

### Step 6: Create the `CourseUpdate` Component

Update your `CourseUpdate.jsx` to allow the user to update a course.

Create a new file `CourseUpdate.jsx` and use the provided markup to build out the structure of the component:

```jsx
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

export default function CourseUpdate() {
  const { id } = useParams();
  const history = useHistory();
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setEstimatedTime(data.estimatedTime);
        setMaterialsNeeded(data.materialsNeeded);
      })
      .catch((error) => console.error("Error fetching course:", error));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedCourse = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
    };
    const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCourse),
    });
    if (response.status === 204) {
      history.push(`/courses/${id}`);
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <>
      {errors.length > 0 && (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="main--flex">
          <div>
            <label htmlFor="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
            />
            <label htmlFor="materialsNeeded">Materials Needed</label>
            <textarea
              id="materialsNeeded"
              name="materialsNeeded"
              value={materialsNeeded}
              onChange={(e) => setMaterialsNeeded(e.target.value)}
            ></textarea>
          </div>
        </div>
        <button className="button" type="submit">
          Update Course
        </button>
        <button
          className="button button-secondary"
          onClick={(event) => {
            event.preventDefault();
            history.push(`/courses/${id}`);
          }}
        >
          Cancel
        </button>
      </form>
    </>
  );
}
```

### Step 7: Connect the API and Frontend

Make sure your API server is running. You can run your Vite development server using:

```sh
npm run dev
```

Visit `http://localhost:5173` in your browser to see your React app. The `CourseList` component should fetch and display the courses from the API. The `CourseDetail`, `CourseCreate`, and `CourseUpdate` components should handle fetching and displaying course details, creating new courses, and updating existing courses, respectively.

Feel free to reach out if you need further assistance or have additional questions!
