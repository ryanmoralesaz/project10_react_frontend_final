import React from "react";

export default function Course({ href = "course-detail.html", courseTitle }) {
  return (
    <a className="course--module course--link" href={href}>
      <h2 className="course--label">Course</h2>
      <h3 className="course--title">{courseTitle}</h3>
    </a>
  );
}
