import { Link, useNavigate } from "react-router-dom";

export default function ActionsBar({
  courseId,
  onDelete,
  isOwner,
  isDeleting,
}) {
  const navigate = useNavigate();
  return (
    <div className="actions--bar">
      <div className="wrap">
        {isOwner && (
          <>
            <Link className="button" to={`/courses/${courseId}/update`}>
              Update Course
            </Link>
            <button className="button" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Course"}
            </button>
          </>
        )}
        <button
          className="button button-secondary"
          onClick={() => navigate("/")}
          disabled={isDeleting}
        >
          Return to List
        </button>
      </div>
    </div>
  );
}
