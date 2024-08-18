import { useContext } from "react";
import UserContext from "../context/UserContext";

const Authenticated = () => {
  const { authUser, actions } = useContext(UserContext);
  return (
    <div>
      {authUser ? (
        <div>
          <h1>{authUser.name} is Authenticated</h1>
          <p>Your username is {authUser.username}</p>
          <button onClick={actions.signOut}>Sign Out</button>
        </div>
      ) : (
        <p>User is not signed in.</p>
      )}
    </div>
  );
};

export default Authenticated;
