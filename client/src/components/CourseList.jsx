import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";
import { useApi } from "../context/useApi";
// import TestButtons from "./TestButtons";

export default function CourseList() {
  const { callApi, fetchCourses, courses } = useApi();
  // utilize useState hook for the courses array
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        await callApi(fetchCourses);
      } catch (error) {
        console.error("error fetching courses", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, [callApi, fetchCourses]);
  if (isLoading) {
    return <div>Loading courses...</div>;
  }
  return (
    <>
      {/* <TestButtons></TestButtons> */}
      <div className="wrap main--grid">
        {courses && courses.length > 0 ? (
          courses.map((course, index) => (
            <Link to={`/courses/${course.id}`} key={course.id || index}>
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
