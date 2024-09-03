import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "./Context";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();

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
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        navigate("/error");
        return null;
      }
    },
    [navigate]
  );

  const apiValue = {
    callApi,
  };

  return <ApiContext.Provider value={apiValue}>{children}</ApiContext.Provider>;
};
