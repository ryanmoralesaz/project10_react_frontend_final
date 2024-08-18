import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { actions } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await actions.signIn({ email, password });
    if (user) {
      navigate("/"); // Redirect to home after sign in
    } else {
      alert("Sign In Failed");
    }
  };

  return (
    <>
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
    </>
  );
}
