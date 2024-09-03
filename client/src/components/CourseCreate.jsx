import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import ValidationErrors from "./ValidationErrors";

export default function CourseCreate() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const { authUser, actions } = useContext(UserContext);
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
    try {
      const courseData = {
        ...course,
        userId: authUser.id,
      };
      const result = await actions.addCourse(courseData);
      if (result.success) {
        await actions.fetchCourses(true);
        if (result.courseId) {
          navigate(`/courses/${result.courseId}`);
        } else {
          navigate("/");
        }
      } else {
        if (result.errors.includes("Internal Server Error")) {
          navigate("/error");
        } else {
          setErrors(result.errors || ["An unknown error occured"]);
        }
      }
    } catch (error) {
      setErrors([error.message || "An unknown error occured"]);
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
