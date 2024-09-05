import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ValidationErrors from "./ValidationErrors";
import { useAuth, useApi } from "../context/useContext";

export default function SignIn() {
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
    setErrors([]);
    // Perform client-side validation
    const clientErrors = [];
    if (!credentials.emailAddress) clientErrors.push("Email is required");
    if (!credentials.password) clientErrors.push("Password is required");

    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }
    const result = await callApi(
      () => signIn(credentials),
      // (errorResult) => {
      //   // console.log("Error received in SignIn:", errorResult.errors);
      //   // setErrors(
      //   //   Array.isArray(errorResult.errors)
      //   //     ? errorResult.errors
      //   //     : [errorResult.errors]
      //   // );
      //   if (
      //     errorResult.errors &&
      //     errorResult.errors.some(
      //       (e) => e.includes("500") || errorResult.status === 500
      //     )
      //   ) {
      //     navigate("/error");
      //   } else {
      //     setErrors(errorResult.errors || ["An unknown error occurred"]);
      //   }
      //   return errorResult;
      // }
      (error) => {
        console.log("Error received in SignIn:", error);
        if (
          error.status === 500 ||
          (error.errors && error.errors.some((e) => e.includes("500")))
        ) {
          navigate("/error");
        } else {
          setErrors(error.errors || ["An unknown error occurred"]);
        }
        return { success: false, errors: error.errors };
      }
    );

    if (result.success) {
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
