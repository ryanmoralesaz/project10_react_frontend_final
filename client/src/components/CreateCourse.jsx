// Import necessary hooks from React and React Router
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import custom components and hooks
import ValidationErrors from "./ValidationErrors";
import { useCourse, useAuth, useApi } from "../context/useContext";

// Define and export the CreateCourse component
export default function CreateCourse() {
  // Cache the authUser object from the useAuth hook
  const { authUser } = useAuth();
  // Cache the actions object from the useCourse hook
  const { actions } = useCourse();
  // Cache the callApi method from the useApi hook
  const { callApi } = useApi();
  // Initialize the navigate function for programmatic routing
  const navigate = useNavigate();

  // Initialize state for the course form data
  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });
  // Initialize state for form errors
  const [errors, setErrors] = useState([]);

  // Handle input changes in the form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    // Prepare course data with user ID
    const courseData = { ...course, userId: authUser.id };
    // Call the API to add the course
    const result = await callApi(() => actions.addCourse(courseData));
    if (result.success) {
      // Fetch updated courses and navigate to the new course page or home
      await actions.fetchCourses(true);
      navigate(result.courseId ? `/courses/${result.courseId}` : "/");
    } else if (result.errors) {
      // Set errors if the API call fails
      setErrors(Array.isArray(result.errors) ? result.errors : [result.errors]);
    }
  };

  return (
    <>
      <h2>Create Course</h2>
      {/* Display validation errors if any */}
      {errors.length > 0 && <ValidationErrors errors={errors} />}
      <div className="form--centered course--modify">
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            {/* Form inputs for course title and description */}
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="title"
                type="text"
                value={course.title}
                onChange={handleChange}
              />
              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="description"
                value={course.description}
                onChange={handleChange}
              ></textarea>
            </div>
            {/* Form inputs for estimated time and materials needed */}
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                value={course.estimatedTime}
                onChange={handleChange}
              />
              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                value={course.materialsNeeded}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          {/* Form submission and cancel buttons */}
          <div className="button-row">
            <button className="button" type="submit">
              Create Course
            </button>
            <button
              className="button button-secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}