import { createContext, useState } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  const signIn = async (credentials) => {
    const encodedCreds = btoa(`${credentials.email}:${credentials.password}`);
    const response = await fetch("http://localhost:5000/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCreds}`,
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const user = await response.json();
      console.log("Received user data:", user);

      updateAuthUser({ ...user, password: credentials.password });
      return user;
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error("Failed to authenticate");
    }
  };

  const signOut = () => {
    updateAuthUser(null);
  };
  const updateAuthUser = (user) => {
    if (user) {
      const authUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,
      };
      console.log("updating auth user:", authUser);
      setAuthUser(authUser);
      Cookies.set("authenticatedUser", JSON.stringify(authUser), {
        expires: 1,
      });
    } else {
      setAuthUser(null);
      Cookies.remove("authenticatedUser");
    }
  };
  return (
    <UserContext.Provider
      value={{ authUser, actions: { signIn, signOut, updateAuthUser } }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
