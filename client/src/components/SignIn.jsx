import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import ValidationErrors from "./ValidationErrors";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useContext(UserContext);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    const user = await actions.signIn({ email, password });
    if (user && user.id) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true }); // Redirect to home after sign in
    } else {
      setErrors([
        "Sign in failed. Please check your credentials and try again.",
      ]);
    }
  };

  return (
    <div className="form--centered authorize">
      <h2>Sign In</h2>
      <ValidationErrors errors={errors} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">
          Sign In
        </button>
        <button
          className="button button-secondary"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
      <p>
        Don&apos;t have a user account? Click here to{" "}
        <Link to="/sign-up">sign up</Link>!
      </p>
    </div>
  );
}
