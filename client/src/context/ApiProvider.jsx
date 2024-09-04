import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "./Context";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();
  const callApi = useCallback(
    async (apiFunction, errorHandler, ...args) => {
      try {
        const result = await apiFunction(...args);
        // Check if result is undefined
        if (result === undefined) {
          throw new Error("API function did not return a result");
        }
        // Only check for success if result is not undefined
        if (result && !result.success) {
          throw result.errors || result.error || "An unknown error occurred";
        }
        return result;
      } catch (error) {
        console.error("API call failed:", error);
        // Check if the error is a server-side 500 error
        if (error.message.includes("500")) {
          navigate("/error"); // Redirect to UnhandledError component
        }
        return errorHandler ? errorHandler(error) : { success: false, error };
      }
    },
    [navigate]
  );

  const apiValue = useMemo(() => ({ callApi }), [callApi]);

  return <ApiContext.Provider value={apiValue}>{children}</ApiContext.Provider>;
};
