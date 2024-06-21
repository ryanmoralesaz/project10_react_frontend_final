import React from "react";

export default function SignUp() {
  return (
    <>
      <form>
        <label forHtml="emailAddress">Email Address</label>
        <input id="emailAddress" name="emailAddress" type="email" defaultValue="" />
        <label forHtml="password">Password</label>
        <input id="password" name="password" type="password" defaultValue="" />
        <button className="button" type="submit">
          Sign In
        </button>
        <button
          className="button button-secondary"
          onClick={(event) => {
            event.preventDefault();
            location.href = "index.html";
          }}
        >
          Cancel
        </button>
      </form>
      <p>
        Don't have a user account? Click here to{" "}
        <a href="sign-up.html">sign up</a>!
      </p>
    </>
  );
}
