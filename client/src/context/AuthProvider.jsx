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

  const performAuthRequest = useCallback(
    async (url, method, userData) => {
      try {
        const encodedCredentials = btoa(
          `${userData.emailAddress}:${userData.password}`
        );
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCredentials}`,
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
          updateAuthUser({ ...data, password: userData.password });
          return { success: true, data };
        } else {
          return {
            success: false,
            errors: data.errors || ["Failed to authenticate"],
            status: response.status,
          };
        }
      } catch (error) {
        console.error("Error during auth request:", error);
        return {
          success: false,
          errors: ["An unexpected error occurred"],
          status: 500,
        };
      }
    },
    [updateAuthUser]
  );

  const signIn = useCallback(
    async ({ emailAddress, password }) => {
      if (!emailAddress || !password) {
        return {
          success: false,
          errors: ["Email and password are required"],
        };
      }
      return performAuthRequest(
        "http://localhost:5000/api/users/signin",
        "POST",
        { emailAddress, password }
      );
    },
    [performAuthRequest]
  );

  const signUp = useCallback(
    async (userData) => {
      return performAuthRequest(
        "http://localhost:5000/api/users",
        "POST",
        userData
      );
    },
    [performAuthRequest]
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
