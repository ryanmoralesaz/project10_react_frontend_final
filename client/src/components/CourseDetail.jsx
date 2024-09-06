import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ActionsBar from "./ActionsBar";
import ValidationErrors from "./ValidationErrors";
import { useCourse, useAuth, useApi } from "../context/useContext";

export default function CourseDetail() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { actions } = useCourse();
  const { authUser } = useAuth();
  const { callApi } = useApi();
  const navigate = useNavigate();

  const loadCourse = useCallback(async () => {
    const result = await callApi(
      () => actions.fetchCourse(id)
      // (error) => {
      //   if (error.errors && error.errors[0].includes("500")) {
      //     navigate("/error");
      //   } else {
      //     setError(error.errors?.[0] || "An unexpected error occurred");
      //   }
      // }
    );
    if (result && result.success) {
      setCourse(result.course);
    } else {
      setError(result.errors?.[0] || "An unexpected error occurred");
    }
  }, [id, actions, callApi]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await callApi(() => actions.deleteCourse(id));

    if (result && result.success) {
      // Redirect to the homepage after deleting the course
      navigate("/", { replace: true });
      await actions.fetchCourses(true);
    } else if (result.errors) {
      // If deletion fails, set the error message
      setError(result.errors?.[0] || "Failed to delete course");
    }

    setIsDeleting(false);
  };

  if (!course && !error) return <p>Loading...</p>;
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
