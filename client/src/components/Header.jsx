import { Link } from "react-router-dom";
import { useAuth } from "../context/useContext";

export default function Header() {
  const { authUser, signOut } = useAuth();

  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <Link to="/">Courses</Link>
        </h1>
        <nav>
          {authUser ? (
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
