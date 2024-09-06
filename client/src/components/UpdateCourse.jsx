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
    const result = await callApi(() => actions.fetchCourse(id));
    if (result && result.success) {
      setCourse(result.course);
      if (authUser && authUser.id !== result.course.User.id) {
        navigate("/forbidden");
        return;
      }
    } else if (result.errors) {
      setErrors(result.errors);
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

  const validateForm = () => {
    const validationErrors = [];
    if (!course.title.trim()) {
      validationErrors.push("Title is required");
    }
    if (!course.description.trim()) {
      validationErrors.push("Description is required");
    }
    if (course.materialsNeeded && course.materialsNeeded.length > 1000) {
      validationErrors.push(
        "Materials needed must be less than 1000 characters"
      );
    }
    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    const result = await callApi(() => actions.updateCourse(id, course));
    if (result.success) {
      await actions.fetchCourses(true);
      navigate(`/courses/${id}`);
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };
  if (isLoading) return <p>Loading...</p>;
  if (!authUser) return <p>Please sign in to update courses.</p>;
  if (!course.User || authUser.id !== course.User.id) {
    return <p>You do not have permission to update this course.</p>;
  }
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
