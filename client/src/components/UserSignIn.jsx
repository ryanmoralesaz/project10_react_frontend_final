import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useAuth, useApi } from "../context/useContext";

export default function UserSignIn() {
  const { signIn } = useAuth();
  const { callApi } = useApi();
  const [credentials, setCredentials] = useState({
    emailAddress: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform client-side validation
    setErrors([]);
    const result = await callApi(() => signIn(credentials));
    if (result.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      setErrors(result.errors || ["Failed to sign in"]);
    }
  };

  return (
    <div className="form--centered authorize">
      <h2>Sign In</h2>
      {errors.length > 0 && <ValidationErrors errors={errors} />}
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={credentials.emailAddress}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button className="button" type="submit">
          Sign In
        </button>
        <button
          className="button button-secondary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          type="button"
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
