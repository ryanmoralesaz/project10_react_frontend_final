import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useAuth } from "../context/useContext";

export default function SignIn() {
  const { signIn, authUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    console.log("Current authUser:", authUser);
  }, [authUser]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    const result = await signIn({ email, password });
    console.log("Sign in result:", result);
    if (result.success) {
      console.log("Sign in successful, user:", result.user);

      console.log(
        "Sign in successful, navigating to:",
        location.state?.from?.pathname || "/"
      );

      const from = location.state?.from?.pathname || "/";
      try {
        navigate(from, { replace: true });
        console.log("Navigation function called");
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    } else {
      console.error("Sign in failed:", result.errors);
      setErrors(result.errors);
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
