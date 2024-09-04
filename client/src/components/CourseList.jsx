import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";
import { useApi, useCourse } from "../context/useContext";

import TestButtons from "./TestButtons";

export default function CourseList() {
  const { callApi } = useApi();
  const { courses, actions } = useCourse();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Calling fetchCourses");
      const result = await callApi(actions.fetchCourses);
      console.log("fetchCourses result:", result);
      if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message);
      if (err.message === "Internal Server Error") {
        navigate("/error");
      }
    } finally {
      setIsLoading(false);
    }
    // try {
    //   console.log("Calling fetchCourses");
    //   await callApi(actions.fetchCourses, (error) => {
    //     console.error("Error fetching courses:", error);
    //     if (error.message === "Internal Server Error") {
    //       navigate("/error");
    //     }
    //   });
    // } catch (error) {
    //   console.error("error fetching courses", error);
    // } finally {
    //   setIsLoading(false);
    // }
  }, [callApi, actions.fetchCourses, navigate]);

  useEffect(() => {
    console.log("CourseList useEffect triggered");
    loadCourses();
  }, [loadCourses, location.key]);

  useEffect(() => {
    console.log("Courses updated in CourseList:", courses);
  }, [courses]);

  if (isLoading) {
    return <div>Loading courses...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <TestButtons />
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
