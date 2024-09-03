import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ApiContext from "./ApiContext";
import { useUser } from "./useUser";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();
  const { actions } = useUser();

  const callApi = useCallback(
    async (apiFunction, ...args) => {
          try {
              console.log('calling with args', ...args);
        const result = await apiFunction(...args);
        console.log("api result", result);
        if (result && result.error === "Internal Server Error") {
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
  };

  return <ApiContext.Provider value={apiValue}>{children}</ApiContext.Provider>;
};
