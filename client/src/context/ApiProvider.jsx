import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ApiContext from "./ApiContext";
import { useUser } from "./useUser";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();
  const { actions, courses, authUser } = useUser();

  const callApi = useCallback(
    async (apiFunction, ...args) => {
      try {
        const result = await apiFunction(...args);
        if (
          result &&
          (result.error === "Internal Server Error" || result.status >= 500)
        ) {
          navigate("/error");
          return null;
        }
        return result;
      } catch (error) {
        console.error("API call failed:", error);
        navigate("/error");
        return null;
      }
    },
    [navigate]
  );

  const apiValue = {
    callApi,
    ...actions,
    courses,
    authUser
  };

  return <ApiContext.Provider value={apiValue}>{children}</ApiContext.Provider>;
};
