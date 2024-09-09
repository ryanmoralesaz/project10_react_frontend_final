// Import Link from React Router for navigation without page reload
import { Link } from "react-router-dom";
// Import the useAuth hook from the context API
import { useAuth } from "../context/useContext";

// Define the Header component
export default function Header() {
  // Cache the authUser object and signOut method from the useAuth hook
  const { authUser, signOut } = useAuth();

  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <Link to="/">Courses</Link>
        </h1>
        <nav>
          {/* Use a ternary operator to conditionally render based on authentication status */}
          {authUser ? (
            // If user is authenticated, show welcome message and sign out button
            <ul className="header--signedin">
              <li>
                Welcome, {authUser.firstName}
                {authUser.lastName}!
              </li>
              <li>
                <button onClick={() => signOut()}>Sign Out</button>
              </li>
            </ul>
          ) : (
            // If user is not authenticated, show sign up and sign in links
            <ul className="header--signedout">
              <li>
                <Link to="/sign-up">Sign Up</Link>
              </li>
              <li>
                <Link to="/sign-in">Sign In</Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
