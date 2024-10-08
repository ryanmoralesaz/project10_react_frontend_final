// export the functional course component with the course title passed as a prop
export default function Course({ courseTitle }) {
  return (
    <div className="course--module course--link">
      <h2 className="course--label">Course</h2>
      <h3 className="course--title">{courseTitle}</h3>
    </div>
  );
}
