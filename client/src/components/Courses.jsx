// Import necessary hooks from React
import { useEffect, useState, useCallback } from "react";
// Import Link from React Router for navigation without page reload
import { Link } from "react-router-dom";
// Import custom components
import Course from "./Course";
import NewCourse from "./CourseNew";
// Import custom hooks from the context API
import { useApi, useCourse } from "../context/useContext";

// Define and export the Courses component
export default function Courses() {
  // Cache the callApi method from the useApi hook
  const { callApi } = useApi();
  // Cache the courses array and actions object from the useCourse hook
  const { courses, actions } = useCourse();
  // Initialize state for error handling and loading status
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define a memoized function to load courses
  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await callApi(actions.fetchCourses);
    if (!result.success) {
      setError((result.errors && result.errors[0]) || "Failed to fetch courses.");
    }
    setIsLoading(false);
  }, [callApi, actions.fetchCourses]);

  // Use effect hook to load courses when component mounts
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Render loading state
  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the list of courses
  return (
    <>
      <div className="wrap main--grid">
        {/* Use a ternary expression to render courses if available, otherwise show a message */}
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <Course
                href={`courses/${course.id}`}
                courseTitle={course.title}
              />
            </Link>
          ))
        ) : (
          <p>No courses available</p>
        )}
        <NewCourse />
      </div>
    </>
  );
}