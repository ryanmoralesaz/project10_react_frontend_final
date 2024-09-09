//necessary imports, Link for clickable anchor tag wrapper triggers routes without full page reload
// useNavigate for route redirection basedo on conditions
import { Link, useNavigate } from "react-router-dom";

// define a functional React component for the user actions on courses
// pass destructured props from the component pages
export default function ActionsBar({
  courseId,// check for id of course 
  onDelete,// the delete handler
  isOwner,//a boolean to check for ownership of the course
  isDeleting, // a boolean to check if course is in state of deletion
}) {
  const navigate = useNavigate();//cache the useNavigate hook to the keyterm navigate
  return (
    <div className="actions--bar">
      <div className="wrap">
        {/* utilize short-circuit evaluation to render update and delete buttons if current user is owner */}
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
        {/* disable the deleting button if the course is in the process of being deleted. */}
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
