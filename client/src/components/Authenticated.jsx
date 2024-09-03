import { useAuth } from "../context/useContext";

const Authenticated = () => {
  const { authUser, signOut } = useAuth();
  return (
    <div>
      {authUser ? (
        <div>
          <h1>{authUser.name} is Authenticated</h1>
          <p>Your username is {authUser.username}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <p>User is not signed in.</p>
      )}
    </div>
  );
};

export default Authenticated;
