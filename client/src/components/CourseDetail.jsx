import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import Error from "./Error";
import ActionsBar from "./ActionsBar";
import UserContext from "../context/UserContext";

export default function CourseDetail() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser, actions } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.status === 404) {
          navigate("/notfound");
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        console.log("fetched data", data);
        setCourse(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch course", error);
        setError(error.message);
        if (error.message.includes("500")) {
          navigate("/error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate, apiUrl]);
  const handleDelete = async () => {
    const success = await actions.deleteCourse(id);
    if (success) {
      console.log("course deleted successfully");
      await actions.fetchCourses(true);
      navigate("/");
    } else {
      console.error("failed to delete course");
      setError("Failed to delete course");
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <Error errorMessage={error} />;
  if (!course) return null;
  return (
    <>
      <ActionsBar
        courseId={id}
        courseUserId={course.User.id}
        onDelete={handleDelete}
        isOwner={authUser && authUser.id === course.User.id}
      />
      <form>
        <div className="main--flex">
          <div>
            <h3 className="course--detail--title">Course</h3>
            <h4 className="course--name">{course.title}</h4>
            <p>
              By {course.User.firstName} {course.User.lastName}{" "}
            </p>
            <ReactMarkdown className="course-description">
              {course.description}
            </ReactMarkdown>
          </div>
          <div>
            <h3 className="course--detail--title">Estimated Time</h3>
            <p>{course.estimatedTime}</p>

            <h3 className="course--detail--title">Materials Needed</h3>
            <ReactMarkdown className="course--materials">
              {course.materialsNeeded}
            </ReactMarkdown>
          </div>
        </div>
      </form>
    </>
  );
}
