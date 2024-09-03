import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ActionsBar from "./ActionsBar";
import ValidationErrors from "./ValidationErrors";
import { useApi } from "../context/useApi.js";

export default function CourseDetail() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { callApi, fetchCourse, deleteCourse, fetchCourses, authUser } =
    useApi();
  useEffect(() => {
    const loadCourse = async () => {
      const result = await callApi(fetchCourse, id);
      console.log("detail result", result);
      if (result) {
        if (result.success) {
          setCourse(result.course);
        } else {
          setError(result.error);
          if (result.error === "Course not found") {
            navigate("/notfound");
          } else if (result.error === "Access denied") {
            navigate("/forbidden");
          }
        }
      }
      setLoading(false);
    };
    loadCourse();
  }, [id, fetchCourse, callApi, navigate]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await callApi(() => deleteCourse(id));
      if (result.success) {
        console.log("course deleted successfully");
        await callApi(() => fetchCourses(true));
        navigate("/");
      } else {
        console.error("failed to delete course");
        setError("Failed to delete course");
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <ValidationErrors errors={[error]} />;
  if (!course) return null;
  return (
    <>
      <ActionsBar
        courseId={id}
        courseUserId={course.User.id}
        onDelete={handleDelete}
        isOwner={authUser && authUser.id === course.User.id}
        isDeleting={isDeleting}
      />
      <h2>Course Detail</h2>
      <form className="course--detail">
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
