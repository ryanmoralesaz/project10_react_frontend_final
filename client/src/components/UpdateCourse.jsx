import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse, useAuth } from "../context/useContext";
import ValidationErrors from "./ValidationErrors";

export default function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useCourse();
  const { authUser } = useAuth();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourse = useCallback(async () => {
    try {
      const result = await actions.fetchCourse(id);
      if (result.status === 500) {
        navigate("/error");
        return;
      }
      if (result.success) {
        setCourse(result.course);
        if (authUser && authUser.id !== result.course.userId) {
          navigate("/forbidden");
        }
      } else {
        if (result.error === "Course not found") {
          navigate("/notfound");
        } else if (result.error === "Access denied") {
          navigate("/forbidden");
        } else {
          setErrors([result.error]);
        }
      }
    } catch (error) {
      console.error("Error loading course:", error);
      setErrors(["An unexpected error occurred"]);
    } finally {
      setIsLoading(false);
    }
  }, [authUser, id, actions, navigate]);

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
    try {
      const result = await actions.updateCourse(id, course);
      if (result.success) {
        await actions.fetchCourses(true);
        navigate(`/courses/${id}`);
      } else if (Array.isArray(result.errors)) {
        setErrors(result.errors);
      } else if (result.error === "Access denied") {
        navigate("/forbidden");
      } else {
        setErrors([
          result.error || "An error occured while udpating the course",
        ]);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      navigate("/error");
    }
  };
  if (isLoading) return <p>Loading...</p>;
  if (!authUser) return <p>Please sign in to update courses.</p>;
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
