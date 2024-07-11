export default function CourseDetail({
  courseTitle,
  courseAuthor,
  courseTime,
  materialItems,
  courseDescription,
}) {
  return (
    <form>
      <div className="main--flex">
        <div>
          <h3 className="course--detail--title">Course</h3>
          <h4 className="course--name">{courseTitle}</h4>
          <p>By {courseAuthor} </p>

          {courseDescription}
        </div>
        <div>
          <h3 className="course--detail--title">Estimated Time</h3>
          <p>{courseTime}</p>

          <h3 className="course--detail--title">Materials Needed</h3>
          <ul className="course--detail--list">
            {materialItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
}
