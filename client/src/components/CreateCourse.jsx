import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useCourse, useAuth, useApi } from "../context/useContext";

export default function CreateCourse() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const { authUser } = useAuth();
  const { actions } = useCourse();
  const { callApi } = useApi();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    const courseData = {
      ...course,
      userId: authUser.id,
    };
    const result = await callApi(
      () => actions.addCourse(courseData),
      (error) => {
        // Check if the error is an array (e.g., validation errors)
        if (Array.isArray(error)) {
          console.log("Validation errors:", error);
          setErrors(error); // Set the array of errors directly
        } else if (error.errors && Array.isArray(error.errors)) {
          // If it's an object with an 'errors' array (additional check)
          console.log("Validation errors:", error.errors);
          setErrors(error.errors);
        } else if (error.message) {
          // If there's a generic error message
          console.log("Error message:", error.message);
          setErrors([error.message]);
        } else {
          // Fallback if the error structure is unknown
          console.log("Unknown error structure:", error);
          setErrors(["An unknown error occurred"]);
        }
      }
    );
    if (result && result.success) {
      await actions.fetchCourses(true);
      navigate(result.courseId ? `/courses/${result.courseId}` : "/");
    }
  };

  return (
    <>
      <h2>Create Course</h2>
      <ValidationErrors errors={errors} />
      <div className="form--centered course--modify">
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
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
