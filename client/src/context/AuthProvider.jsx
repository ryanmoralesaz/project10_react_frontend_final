import { useCallback, useState, useMemo } from "react";
import { AuthContext } from "./Context";
import Cookies from "js-cookie";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    async ({ emailAddress, password }) => {
      if (!emailAddress || !password) {
        // return {
        //   success: false,
        //   errors: ["Email and password are required"],
        // };
        throw { errors: ["Email and password are required"] };
      }
      const encodedCreds = btoa(`${emailAddress}:${password}`);
      const response = await fetch(`http://localhost:5000/api/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCreds}`,
        },
        // body: JSON.stringify(credentials),
      });
      console.log("Sign in response status:", response.status);
      if (response.status === 500) {
        throw { errors: ["500 Internal Server Error"], status: 500 };
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw {
          success: false,
          errors: errorData.errors || ["Failed to authenticate"],
        };
      }
      const user = await response.json();
      updateAuthUser({ ...user, password });
      return { success: true, user };
    },
    [updateAuthUser]
  );

  const signUp = useCallback(
    async (userData) => {
      try {
        const response = await fetch(`http://localhost:5000/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          return signIn({
            emailAddress: userData.emailAddress,
            password: userData.password,
          });
        } else {
          const errorData = await response.json();
          throw {
            success: false,
            errors: errorData.errors || ["An error occurred during sign up."],
          };
        }
      } catch (error) {
        console.error("Error signing up:", error);
        throw {
          success: false,
          errors: error.errors || ["An unexpected error occurred"],
        };
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
