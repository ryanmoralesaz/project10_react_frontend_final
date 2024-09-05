import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "./Context";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();
  const callApi = useCallback(
    async (apiFunction, errorHandler, ...args) => {
      try {
        const result = await apiFunction(...args);
        // if (!result.success) {
        //   throw result;
        // }
        return result;
      } catch (error) {
        if (error.errors && error.errors.some((e) => e.includes("500"))) {
          navigate("/error");
          return { success: false, errors: ["Internal Server Error"] };
        }
        const formattedError = error.errors
          ? error
          : {
              success: false,
              errors: [error.message || "An unknown error occurred"],
            };
        return errorHandler ? errorHandler(formattedError) : formattedError;
      }
    },
    [navigate]
  );
  const apiValue = useMemo(() => ({ callApi }), [callApi]);

  return <ApiContext.Provider value={apiValue}>{children}</ApiContext.Provider>;
};
