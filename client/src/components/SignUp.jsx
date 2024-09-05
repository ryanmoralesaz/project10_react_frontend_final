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
    // const clientErrors = [];
    // if (!formData.firstName) clientErrors.push("First name is required");
    // if (!formData.lastName) clientErrors.push("Last name is required");
    // if (!formData.emailAddress) clientErrors.push("Email address is required");
    // if (!formData.password) clientErrors.push("Password is required");

    // if (clientErrors.length > 0) {
    //   setErrors(clientErrors);
    //   return;
    // }

    const result = await callApi(
      () => signUp(formData),
      (errorResult) => {
        console.log("Error received in SignUp:", errorResult.errors);
        // setErrors(errorResult.errors);
        if (
          errorResult.errors &&
          errorResult.errors.some((e) => e.includes("500"))
        ) {
          navigate("/error");
        } else {
          setErrors(errorResult.errors || ["An unknown error occurred"]);
        }
        return errorResult;
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
