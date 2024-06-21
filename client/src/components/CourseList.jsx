import React from "react";
import Course from "./Course";
import NewCourse from "./NewCourse";

const courses = [
  { href: "course-detail.html", title: "Build a Basic Bookcase" },
  { href: "course-detail.html", title: "Learn How to Program" },
  { href: "course-detail.html", title: "Learn How to Test Program" },
];

export default function CourseList() {
  return (
    <div className="wrap main--grid">
      {courses.map((course, index) => (
        <Course href={course.href} courseTitle={course.title} key={index} />
      ))}
      <NewCourse />
    </div>
  );
}
