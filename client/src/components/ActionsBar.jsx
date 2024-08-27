// import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import UserContext from "../context/UserContext";

export default function ActionsBar({
  courseId,
  // courseUserId,
  onDelete,
  isOwner,
}) {
  // const { authUser } = useContext(UserContext);
  const navigate = useNavigate();
  // console.log("Authuser id:", authUser?.id, "Type", typeof authUser?.id);

  // console.log("course user id", courseUserId, "type", typeof courseUserId);
  // console.log("is owner", isOwner);
  return (
    <div className="actions--bar">
      <div className="wrap">
        {isOwner && (
          <>
            <Link className="button" to={`/courses/${courseId}/update`}>
              Update Course
            </Link>
            <button className="button" onClick={onDelete}>
              Delete Course
            </button>
          </>
        )}
        <button
          className="button button-secondary"
          onClick={() => navigate("/")}
        >
          Return to List
        </button>
      </div>
    </div>
  );
}
