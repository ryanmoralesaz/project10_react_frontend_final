// Import necessary hooks and components
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useAuth, useApi } from "../context/useContext";

// Define the UserSignUp component
export default function UserSignUp() {
  // Cache methods from custom hooks
  const { signUp } = useAuth();
  const { callApi } = useApi();

  // Initialize state for form data and errors
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  // Initialize navigation
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    const result = await callApi(() => signUp(formData));
    if (result.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      setErrors(result.errors || ["Failed to sign up"]);
    }
  };

  // Render the sign-up form
  return (
    <div className="form--centered authorize">
      {errors.length > 0 && <ValidationErrors errors={errors} />}
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
        />
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={formData.emailAddress}
          onChange={handleChange}
          autoComplete="off"
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button className="button" type="submit">
          Sign Up
        </button>
        <button
          className="button button-secondary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Cancel
        </button>
      </form>

      <p>
        Already have a user account? <Link to="/sign-in">Sign in</Link>!
      </p>
    </div>
  );
}
