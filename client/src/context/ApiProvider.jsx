import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "./Context";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();

  const callApi = useCallback(
    async (apiFunction, errorHandler, ...args) => {
      try {
        const result = await apiFunction(...args);
        if (result && result.status >= 400) {
          switch (result.status) {
            case 401:
              navigate("/signin");
              break;
            case 403:
              navigate("/forbidden");
              break;
            case 404:
              navigate("/notfound");
              break;
            case 500:
              navigate("/error");
              break;
            default:
              if (errorHandler) {
                errorHandler(result);
              } else {
                console.error("API error:", result);
              }
          }
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
  };

  return <ApiContext.Provider value={apiValue}>{children}</ApiContext.Provider>;
};
