import { useCallback, useState, useMemo } from "react";
import { AuthContext } from "./Context";
import Cookies from "js-cookie";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const cookie = Cookies.get("authenticatedUser");
    return cookie ? JSON.parse(cookie) : null;
  });

  const updateAuthUser = useCallback((user) => {
    if (user) {
      const authUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,
      };
      setAuthUser(authUser);
      Cookies.set("authenticatedUser", JSON.stringify(authUser), {
        expires: 1,
      });
    } else {
      setAuthUser(null);
      Cookies.remove("authenticatedUser");
    }
  }, []);

  const signIn = useCallback(
    async ({ email, password }) => {
      try {
        const encodedCreds = btoa(`${email}:${password}`);
        const response = await fetch("http://localhost:5000/api/users/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCreds}`,
          },
          // body: JSON.stringify(credentials),
        });
        console.log("Sign in response status:", response.status);

        if (response.ok) {
          const user = await response.json();
          updateAuthUser({ ...user, password });
          return { success: true, user };
        } else if (response.status === 401) {
          return {
            success: false,
            errors: ["User does not exist or credentials are incorrect."],
          };
        } else {
          return { success: false, errors: ["Failed to authenticate"] };
        }
      } catch (error) {
        console.error("Error signing in:", error);
        return { success: false, errors: ["An unexpected error occurred"] };
      }
    },
    [updateAuthUser]
  );

  const signUp = useCallback(
    async (userData) => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          return signIn({
            email: userData.emailAddress,
            password: userData.password,
          });
        } else if (response.status === 400) {
          const data = await response.json();
          return {
            success: false,
            errors: data.errors || ["An error occurred during sign up."],
          };
        } else {
          return { success: false, errors: ["Failed to sign up"] };
        }
      } catch (error) {
        console.error("Error signing up:", error);
        return { errors: ["An unexpected error occurred"] };
      }
    },
    [signIn]
  );

  const signOut = useCallback(() => {
    updateAuthUser(null);
  }, [updateAuthUser]);

  const contextValue = useMemo(
    () => ({
      authUser,
      signIn,
      signUp,
      signOut,
      updateAuthUser,
    }),
    [authUser, signIn, signUp, signOut, updateAuthUser]
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
