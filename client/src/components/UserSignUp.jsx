import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useAuth, useApi } from "../context/useContext";

export default function UserSignUp() {
  const { signUp } = useAuth();
  const { callApi } = useApi();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

// Clear validation errors as the user types in the input field
  useEffect(() => {
    if (isSubmitted && errors.length > 0) {
      const newErrors = errors.filter((error) => {
        if (error.includes("First name") && formData.firstName) return false;
        if (error.includes("Last name") && formData.lastName) return false;
        if (error.includes("Email address") && formData.emailAddress) return false;
        if (error.includes("Password") && formData.password) return false;
        return true;
      });

      if (newErrors.length !== errors.length) {
        setErrors(newErrors);
      }

      // If no more validation errors remain, disable further useEffect executions
      if (newErrors.length === 0) {
        setIsSubmitted(false);
      }
    }
  }, [formData, errors, isSubmitted]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      setErrors((prevErrors) =>
        prevErrors.filter((error) => !error.includes(name))
      );
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = [];
    if (!formData.firstName) newErrors.push("First name is required");
    if (!formData.lastName) newErrors.push("Last name is required");
    if (!formData.emailAddress) newErrors.push("Email address is required");
    if (!formData.password) newErrors.push("Password is required");
    setErrors(newErrors);
    return newErrors;
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    const formErrors = validateForm();
    // setErrors(formErrors);
    if (formErrors.length === 0) {
      const result = await callApi(() => signUp(formData));
      if (result.success) {
        navigate("/");
      } else {
        setErrors(result.errors || ["Failed to sign up"]);
      }
    }
  };

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
