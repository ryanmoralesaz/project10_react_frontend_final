import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ActionsBar from "./ActionsBar";
import ValidationErrors from "./ValidationErrors";
import { useCourse, useAuth } from "../context/useContext";

export default function CourseDetail() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { actions } = useCourse();
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const loadCourse = useCallback(async () => {
    try {
      const result = await actions.fetchCourse(id);
      console.log("detail result", result);
      if (result) {
        if (result.success) {
          setCourse(result.course);
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      console.error("Error loading course:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [id, actions]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    if (error === "Course not found") {
      navigate("/notfound");
    } else if (error === "Access denied") {
      navigate("/forbidden");
    }
  }, [error, navigate]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await actions.deleteCourse(id);
      if (result.success) {
        await actions.fetchCourses(true);
        navigate("/", { replace: true });
      } else {
        console.error("Failed to delete course:", result.error);
        setError(result.error || "Failed to delete course");
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
