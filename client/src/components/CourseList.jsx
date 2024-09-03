import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";
import UserContext from "../context/UserContext";
import TestButtons from "./TestButtons";

export default function CourseList() {
  // utilize useState hook for the courses array
  const { courses, actions } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        await actions.fetchCourses();
      } catch (error) {
        console.error("error fetching courses", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, [actions]);
  if (isLoading) {
    return <div>Loading courses...</div>;
  }
  return (
    <>
      <TestButtons></TestButtons>
      <div className="wrap main--grid">
        {courses.map((course, index) => (
          <Link to={`/courses/${course.id}`} key={course.id || index}>
            <Course href={`courses/${course.id}`} courseTitle={course.title} />
          </Link>
        ))}
        <NewCourse />
      </div>
    </>
  );
}
