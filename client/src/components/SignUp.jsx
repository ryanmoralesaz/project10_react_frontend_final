import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useAuth, useApi } from "../context/useContext";

export default function SignUp() {
  const { signUp } = useAuth();
  const { callApi } = useApi();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`Field: ${name}, Value: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    const result = await callApi(
      () => signUp(formData),
      (error) => {
        console.log("Error received in SignUp:", error);

        if (Array.isArray(error)) {
          // Handle array errors (e.g., validation errors)
          setErrors(error);
        } else if (error.errors && Array.isArray(error.errors)) {
          // Handle errors object with an errors array
          setErrors(error.errors);
        } else if (error.message) {
          // Handle a generic error message
          setErrors([error.message]);
        } else {
          // Fallback for unknown error structure
          setErrors(["An unknown error occurred during sign up."]);
        }
      }
    );
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="form--centered authorize">
      <ValidationErrors errors={errors} />
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
          value={formData.email}
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
          onClick={() => navigate("/")}
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
