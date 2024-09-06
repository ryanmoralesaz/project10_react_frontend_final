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
    setErrors([]);
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    const courseData = { ...course, userId: authUser.id };
    const result = await callApi(
      () => actions.addCourse(courseData)
    );

    if (result.success) {
      await actions.fetchCourses(true);
      navigate(result.courseId ? `/courses/${result.courseId}` : "/");
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };
  return (
    <>
      <h2>Create Course</h2>
      {errors.length > 0 && <ValidationErrors errors={errors} />}
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
                // required
              />

              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="description"
                value={course.description}
                onChange={handleChange}
                // required
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
