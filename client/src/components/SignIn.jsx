import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useAuth, useApi } from "../context/useContext";

export default function SignIn() {
  const { signIn, authUser } = useAuth();
  const { callApi } = useApi();
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
    const result = await callApi(
      () => signIn({ email, password }),
      (error) => {
        setErrors(
          Array.isArray(error.errors)
            ? error.errors
            : [error.message || "Sign in failed"]
        );
      }
    );
    if (result && result.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
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
