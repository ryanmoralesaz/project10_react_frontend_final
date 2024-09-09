// Import the custom hook for the authenticatiol context
import { useAuth } from "../context/useContext";
// Define a functional react component for displaying the authenticated user
const Authenticated = () => {
  // cache the destructured authUser and signOut methods from the useAuth hook
  const { authUser, signOut } = useAuth();
  return (
    <div>
      {/* Use a ternary expression to render the user's name and sign out button if user is signed in otherwise show a user signed in message.*/}
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
