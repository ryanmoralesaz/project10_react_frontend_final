// import the necessary hooks from React and React Router
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import reactmarkdown for rendering mark down content
import ReactMarkdown from "react-markdown";
//import custom components
import ActionsBar from "./ActionsBar";
import ValidationErrors from "./ValidationErrors";
// import the custom hooks from the context api
import { useCourse, useAuth, useApi } from "../context/useContext";

// export the CourseDetail functional component
export default function CourseDetail() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  // cache the course id from the url params
  const { id } = useParams();
  // initialize the state of the component
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // cache the methods from the custom hooks
  const { actions } = useCourse();
  const { authUser } = useAuth();
  const { callApi } = useApi();
  const navigate = useNavigate();

  // Define a memoized ffnction to load the course data
  const loadCourse = useCallback(async () => {
    const result = await callApi(() => actions.fetchCourse(id));
    // update the application state based on the result of the API call
    if (result && result.success) {
      setCourse(result.course);
    } else {
      setError(result.errors?.[0] || "An unexpected error occurred");
    }
  }, [id, actions, callApi]);

  // Fire use effect to load course data when component mounts first time or loadCourse method changes
  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  // Define the course deletion handler
  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await callApi(() => actions.deleteCourse(id));
    if (result && result.success) {
      // Redirect to the homepage after deleting the course
      navigate("/", { replace: true });
      // reload the courses to reflect deleted course state change
      await actions.fetchCourses(true);
    } else if (result.errors) {
      // If deletion fails, set the error message
      setError((result.errors && result.errors[0]) || "Failed to delete course");
    }
    setIsDeleting(false);
  };
// render a loading message if the course isn't loaded and there are no errors
  if (!course && !error) return <p>Loading...</p>;
  // render the validation errors component if there is an error
  if (error) return <ValidationErrors errors={[error]} />;
  // if course data is null render nothing
  if (!course) return null;
  // if course data is available, render the details
  return (
    <>
    {/* pass the required props to the actions bar component */}
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
