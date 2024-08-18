import { createContext, useState } from "react";
import Cookies from "js-cookie";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);
  const signIn = async (credentials) => {
    const response = await fetch("/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const user = await response.json();
      setAuthUser(user);
      Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
      return user;
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error("Failed to authenticate");
    }
  };
  const signOut = () => {
    setAuthUser(null);
    Cookies.remove("authenticatedUser");
  };
  return (
    <UserContext.Provider value={{ authUser, actions: { signIn, signOut } }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
