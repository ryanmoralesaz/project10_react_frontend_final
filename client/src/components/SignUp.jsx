import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });
  const navigate = useNavigate();
  const { actions } = useContext(UserContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`Field: ${name}, Value: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const user = await response.json();
        actions.updateAuthUser(user);
        // await actions.signIn({
        //   email: formData.emailAddress,
        //   password: formData.password,
        // });
        navigate("/");
      } else {
        alert("Failed to sign up");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <>
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
    </>
  );
}
