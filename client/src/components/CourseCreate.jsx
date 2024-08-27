import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function CourseCreate() {
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
    let encodedCreds = btoa(`${authUser.emailAddress}:${authUser.password}`);
    setErrors([]);
    try {
      // console.log("Sending course data:", course);
      // console.log("Auth user:", authUser);
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCreds}`,
        },
        body: JSON.stringify(course),
      });
      // console.log("response ", response.status);
      if (response.status === 201) {
        const locationHeader = response.headers.get("Location");
        if (locationHeader) {
          const newCourseId = locationHeader.split("/").pop();
          await actions.fetchCourses(true);

          navigate(`/courses/${newCourseId}`);
          // try {
          //   const newCourse = await response.json();
          //   actions.addCourse(newCourse);
          // } catch (error) {
          //   console.error("Error parsing response:", error);
          // }
        } else {
          console.log(
            "Course created successfully, but no location header provided"
          );
          await actions.fetchCourses(true);
          navigate("/");
        }
      } else {
        try {
          const data = await response.json();
          if (response.status === 400) {
            setErrors(data.errors || ["Validation failed"]);
          } else {
            setErrors([data.errors || "An unknown error occured"]);
          }
        } catch (error) {
          console.error("Error parsing error response:", error);
          setErrors(["An unknown error occurred"]);
        }
      }
    } catch (error) {
      console.error("error creating course", error);
      setErrors(["An unknown error occured"]);
    }
  };
  return (
    <div className="form--centered">
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
        <button className="button" type="submit">
          Create Course
        </button>
        <button
          className="button button-secondary"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
