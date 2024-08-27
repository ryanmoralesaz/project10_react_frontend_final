import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";
import UserContext from "../context/UserContext";

// const courses = [
//   { href: "course-detail.html", title: "Build a Basic Bookcase" },
//   { href: "course-detail.html", title: "Learn How to Program" },
//   { href: "course-detail.html", title: "Learn How to Test Program" },
// ];

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
  //  const fetchCoursesCallback = useCallback(async () => {
  //     try {
  //       await actions.fetchCourses();
  //     } catch (error) {
  //       console.error("error fetching courses", error);
  //     }
  //   }, [actions]);

  //   useEffect(() => {
  //     fetchCoursesCallback();
  //   }, [fetchCoursesCallback]);

  // create a useEffect hook that will fetch the courses from
  // the api. Ensure it only runs once with an empty dependency array

  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchCourses = async () => {
  //     try {
  //       actions.fetchCourses();
  //     } catch (error) {
  //       if (isMounted) {
  //         console.error("error fetching courses", error);
  //       }
  //     }
  //   };
  //   fetchCourses();
  //   // const fetchCourses = async () => {
  //   //   try {
  //   //     const response = await fetch("http://localhost:5000/api/courses");
  //   //     const data = await response.json();
  //   //     if (Array.isArray(data)) {
  //   //       setCourses(data);
  //   //     } else {
  //   //       console.error("Data is not an array", data);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("error fetching courses:", error);
  //   //   }
  //   // };
  //   // fetchCourses();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [actions.fetchCourses]);
  if (isLoading) {
    return <div>Loading courses...</div>;
  }
  return (
    <div className="wrap main--grid">
      {courses.map((course, index) => (
        <Link to={`/courses/${course.id}`} key={course.id || index}>
          <Course href={`courses/${course.id}`} courseTitle={course.title} />
        </Link>
      ))}
      <NewCourse />
    </div>
  );
}
