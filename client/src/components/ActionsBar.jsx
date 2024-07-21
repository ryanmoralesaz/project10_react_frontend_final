import { Link } from "react-router-dom";

export default function ActionsBar({ courseId }) {
  return (
    <div className="actions--bar">
      <div className="wrap">
        <Link className="button" to={`/courses/${courseId}/update`}>
          Update Course
        </Link>
        <button
          className="button"
          onClick={() => {
            console.log();
          }}
        >
          Delete Course
        </button>
        <button
          className="button button-secondary"
          onClick={() => {
            console.log();
          }}
        >
          Return to List
        </button>
      </div>
    </div>
  );
}
