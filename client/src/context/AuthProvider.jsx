import { useCallback, useState, useMemo } from "react";
import { AuthContext } from "./Context";
import Cookies from "js-cookie";
import { useApi } from "./useContext";

export const AuthProvider = ({ children }) => {
  const { callApi } = useApi();
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
      return await callApi(async () => {
        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (method !== "GET") {
          options.body = JSON.stringify(userData);
        }

        if (userData.emailAddress && userData.password) {
          const encodedCredentials = btoa(
            `${userData.emailAddress}:${userData.password}`
          );
          options.headers.Authorization = `Basic ${encodedCredentials}`;
        }

        const response = await fetch(url, options);

        if (response.status === 204 || response.status === 201) {
          return { success: true };
        }

        if (!response.ok) {
          if (response.status === 401) {
            throw {
              status: response.status,
              errors: [
                "Invalid credentials.", "Please check email and password.",
              ],
            };
          }

          const errorData = await response.json();
          throw {
            status: response.status,
            errors: errorData.errors || [
              `HTTP error! status: ${response.status}`,
            ],
          };
        }

        const data = await response.json();
        return { success: true, data };
      });
    },
    [callApi]
  );

  const signIn = useCallback(
    async ({ emailAddress, password }) => {
      if (!emailAddress || !password) {
        return {
          success: false,
          errors: ["Email and password are required"],
        };
      }
      const result = await performAuthRequest(
        "http://localhost:5000/api/users",
        "GET",
        { emailAddress, password }
      );
      if (result.success) {
        updateAuthUser({ ...result.data, password });
      }
      return result;
    },
    [performAuthRequest, updateAuthUser]
  );

  const signUp = useCallback(
    async (userData) => {
      const result = await performAuthRequest(
        "http://localhost:5000/api/users",
        "POST",
        userData
      );
      if (result.success) {
        return signIn({
          emailAddress: userData.emailAddress,
          password: userData.password,
        });
      }
      return result;
    },
    [performAuthRequest, signIn]
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
