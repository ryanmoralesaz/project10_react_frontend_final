// Import necessary hooks from React and React Router
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Import custom hooks from context
import { useCourse, useAuth, useApi } from "../context/useContext";
// Import ValidationErrors component for displaying errors
import ValidationErrors from "./ValidationErrors";

// Define the UpdateCourse component
export default function UpdateCourse() {
  // Cache the course id from URL params
  const { id } = useParams();
  // Initialize navigation function
  const navigate = useNavigate();
  // Cache methods and data from custom hooks
  const { actions } = useCourse();
  const { authUser } = useAuth();
  const { callApi } = useApi();

  // Initialize state for course data, errors, and loading status
  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    User: null,
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define a memoized function to load course data
  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    const result = await callApi(() => actions.fetchCourse(id));
    if (result && result.success) {
      setCourse(result.course);
      // Redirect to forbidden page if user doesn't own the course
      if (authUser && authUser.id !== result.course.User.id) {
        navigate("/forbidden");
        return;
      }
    } else if (result.errors) {
      setErrors(result.errors);
    }
    setIsLoading(false);
  }, [authUser, id, actions, navigate, callApi]);

  // Load course data on component mount
  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    const result = await callApi(() => actions.updateCourse(id, course));
    if (result.success) {
      await actions.fetchCourses(true);
      navigate(`/courses/${id}`);
    } else if (result.errors) {
      setErrors(Array.isArray(result.errors) ? result.errors : [result.errors]);
    }
  };

  // Render loading state
  if (isLoading) return <p>Loading...</p>;
  // Render message if user is not authenticated
  if (!authUser) return <p>Please sign in to update courses.</p>;
  // Render message if user doesn't have permission
  if (!course.User || authUser.id !== course.User.id) {
    return <p>You do not have permission to update this course.</p>;
  }

  // Render the update course form
  return (
    <>
      <h2>Update Course</h2>
      {errors.length > 0 && <ValidationErrors errors={errors} />}
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
