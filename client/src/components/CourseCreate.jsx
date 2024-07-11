export default function CourseCreate({}) {
  return (
    <>
      <div className="validation--errors">
        <h3>Validation Errors</h3>
        <ul>
          <li>Please provide a value for "Title"</li>
          <li>Please provide a value for "Description"</li>
        </ul>
      </div>
      <form>
        <div className="main--flex">
          <div>
            <label forHtml="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              defaultValue=""
            />

            <p>By Joe Smith</p>

            <label forHtml="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
            ></textarea>
          </div>
          <div>
            <label forHtml="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              defaultValue=""
            />

            <label forHtml="materialsNeeded">Materials Needed</label>
            <textarea id="materialsNeeded" name="materialsNeeded"></textarea>
          </div>
        </div>
        <button className="button" type="submit">
          Create Course
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
    </>
  );
}
