export default function CourseUpdate({
  courseAuthor,
  courseDescription,
  materialItems,
  courseTime,
  courseTitle,
}) {
  return (
    <form>
      <div className="main--flex">
        <div>
          <label htmlFor="courseTitle">Course Title</label>
          <input
            id="courseTitle"
            name="courseTitle"
            type="text"
            defaultValue={courseTitle}
          />

          <p>By {courseAuthor} </p>

          <label htmlFor="courseDescription">Course Description</label>
          <textarea
            id="courseDescription"
            name="courseDescription"
            defaultValue={courseDescription}
          ></textarea>
        </div>
        <div>
          <label htmlFor="estimatedTime">Estimated Time</label>
          <input
            id="estimatedTime"
            name="estimatedTime"
            type="text"
            defaultValue={courseTime}
          />

          <label htmlFor="materialsNeeded">Materials Needed</label>
          <textarea
            id="materialsNeeded"
            name="materialsNeeded"
            defaultValue={materialItems}
          ></textarea>
        </div>
      </div>
      <button className="button" type="submit">
        Update Course
      </button>
      <button
        className="button button-secondary"
        onClick={(event) => {
          event.preventDefault();
          location.href = "index.html";
        }}
      >
        Cancel
      </button>
    </form>
  );
}
