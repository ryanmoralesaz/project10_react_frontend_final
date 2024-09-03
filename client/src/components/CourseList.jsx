import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";
import { useApi, useCourse } from "../context/useContext";

// import TestButtons from "./TestButtons";

export default function CourseList() {
  const { callApi } = useApi();
  const { courses, actions } = useCourse();
  // utilize useState hook for the courses array
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        await callApi(actions.fetchCourses);
      } catch (error) {
        console.error("error fetching courses", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, [callApi, actions.fetchCourses]);
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
