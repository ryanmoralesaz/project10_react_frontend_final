import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Course from "./Course";
import NewCourse from "./CourseNew";

// const courses = [
//   { href: "course-detail.html", title: "Build a Basic Bookcase" },
//   { href: "course-detail.html", title: "Learn How to Program" },
//   { href: "course-detail.html", title: "Learn How to Test Program" },
// ];

export default function CourseList() {
  // utilize useState hook for the courses array
  const [courses, setCourses] = useState([]);

  // create a useEffect hook that will fetch the courses from
  // the api. Ensure it only runs once with an empty dependency array

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error("Data is not an array", data);
        }
      } catch (error) {
        console.error("error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className="wrap main--grid">
      {courses.map((course, index) => (
        <Link to={`/courses/${course.id}`} key={index}>
          <Course href={`courses/${course.id}`} courseTitle={course.title} />
        </Link>
      ))}
      <NewCourse />
    </div>
  );
}
