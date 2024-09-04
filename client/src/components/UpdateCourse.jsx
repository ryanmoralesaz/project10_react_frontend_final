import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse, useAuth, useApi } from "../context/useContext";
import ValidationErrors from "./ValidationErrors";

export default function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useCourse();
  const { authUser } = useAuth();
  const { callApi } = useApi();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    User: null,
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    const result = await callApi(
      () => actions.fetchCourse(id),
      (error) => {
        // Check if the error is an array or object
        if (Array.isArray(error)) {
          setErrors(error);
        } else if (error.message) {
          setErrors([error.message || "Failed to load course"]);
        } else {
          setErrors(["An unknown error occurred"]);
        }
      }
    );
    if (result && result.success) {
      setCourse(result.course);
      console.log("Loaded course:", result.course);
      console.log("Auth user:", authUser);
      if (authUser && authUser.id !== result.course.User.id) {
        console.log("User does not own this course. Redirecting to forbidden.");

        navigate("/forbidden");
      }
    }
    setIsLoading(false);
  }, [authUser, id, actions, navigate, callApi]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await callApi(
      () => actions.updateCourse(id, course),
      (error) => {
        console.log("Error received in UpdateCourse:", error);

        // Handle validation errors or message errors
        if (Array.isArray(error)) {
          setErrors(error); // Set validation errors if they exist
        } else if (error.errors && Array.isArray(error.errors)) {
          setErrors(error.errors); // Handle structured errors
        } else if (typeof error === "string") {
          setErrors([error]); // Handle string errors
        } else if (error.message) {
          setErrors([error.message || "Failed to update course"]); // General error handling
        } else {
          setErrors(["An unknown error occurred"]);
        }
      }
    );
    if (result && result.success) {
      await actions.fetchCourses(true);
      navigate(`/courses/${id}`);
    }
  };
  if (isLoading) return <p>Loading...</p>;
  if (!authUser) return <p>Please sign in to update courses.</p>;
  if (!course.User || authUser.id !== course.User.id) {
    console.log("User does not own this course. Showing error message.");
    return <p>You do not have permission to update this course.</p>;
  }
  return (
    <>
      <h2>Update Course</h2>
      <ValidationErrors errors={errors} />
      <div className="form--centered course--modify">
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="title">Course Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={course.title}
                onChange={handleChange}
              />
              <label htmlFor="description">Course Description</label>
              <textarea
                id="description"
                name="description"
                onChange={handleChange}
                value={course.description}
              />
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
                onChange={handleChange}
                value={course.materialsNeeded}
              />
            </div>
          </div>
          <div className="button-row">
            <button className="button" type="submit">
              Update Course
            </button>
            <button
              className="button button-secondary"
              onClick={() => navigate(`/courses/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
