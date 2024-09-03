import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import ValidationErrors from "./ValidationErrors";

export default function CourseUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useContext(UserContext);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const loadCourse = async () => {
      const { success, course, error } = await actions.fetchCourse(id);
      if (success) {
        setCourse(course);
      } else if (error === "Course not found") {
        navigate("/notfound");
      } else if (error === "Access denied") {
        navigate("/forbidden");
      } else {
        setErrors([error]);
      }
    };
    loadCourse();
  }, [id, actions, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { success, errors } = await actions.updateCourse(id, course);
    if (success) {
      actions.fetchCourses(true);
      navigate(`/courses/${id}`);
    } else if (errors.includes("Access denied")) {
      navigate("/forbidden");
    } else if (errors.includes("Internal Server Error")) {
      navigate("/error");
    } else {
      setErrors(errors);
    }
  };
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
