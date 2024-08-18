import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function CourseUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        const data = await response.json();
        setCourse({
          title: data.title,
          description: data.description,
          estimatedTime: data.estimatedTime,
          materialsNeeded: data.materialsNeeded,
        });
      } catch (error) {
        console.error("Error fetching course:", error);
        setErrors([error.message]);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      if (response.ok) {
        navigate(`/courses/${id}`);
      } else {
        const data = await response.json();
        setErrors(data.errors || ["An error occurred during the update."]);
      }
    } catch (error) {
      console.error("Failed to update course:", error);
      setErrors([error.message]);
    }
  };

  if (errors.length > 0) {
    return (
      <div className="validation--errors">
        <h3>Validation Errors</h3>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
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
          <ReactMarkdown>{course.description}</ReactMarkdown>
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
            value={course.materialisNeeded}
          />
          <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
        </div>
      </div>
      <button className="button" type="submit">
        Update Course
      </button>
      <button
        className="button button-secondary"
        onClick={() => navigate(`/courses/${id}`)}
      >
        Cancel
      </button>
    </form>
  );
}
