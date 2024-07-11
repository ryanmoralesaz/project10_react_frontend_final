export default function ActionsBar({ href }) {
  return (
    <div className="actions--bar">
      <div className="wrap">
        <a className="button" href="update-course.html">
          Update Course
        </a>
        <a className="button" href="#">
          Delete Course
        </a>
        <a className="button button-secondary" href="index.html">
          Return to List
        </a>
      </div>
    </div>
  );
}
