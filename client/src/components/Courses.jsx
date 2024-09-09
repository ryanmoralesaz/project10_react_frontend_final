import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";
import { useApi, useCourse } from "../context/useContext";

export default function Courses() {
  const { callApi } = useApi();
  const { courses, actions } = useCourse();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const location = useLocation();

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await callApi(actions.fetchCourses);
    if (!result.success) {
      setError((result.errors && result.errors[0]) || "Failed to fetch courses.");
    }
    setIsLoading(false);
  }, [callApi, actions.fetchCourses]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  if (isLoading) {
    return <div>Loading courses...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <div className="wrap main--grid">
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
