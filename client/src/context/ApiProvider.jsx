import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "./Context";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();
  const callApi = useCallback(
    async (apiFunction, errorHandler, ...args) => {
      try {
        const result = await apiFunction(...args);
        return result;
      } catch (error) {
        // Handle unexpected errors
        const formattedError = {
          success: false,
          errors: error.errors || [
            error.message || "An unknown error occurred",
          ],
          status: error.status,
        };

        if (
          formattedError.status === 500 ||
          formattedError.errors.some((e) => e.includes("Internal Server Error"))
        ) {
          navigate("/error");
          return { success: false, errors: ["Internal Server Error"] };
        }

        if (
          formattedError.status === 404 ||
          formattedError.errors.includes("Course not found")
        ) {
          navigate("/notfound");
          return { success: false, errors: ["Course not found"] };
        }

        if (
          formattedError.status === 403 ||
          formattedError.errors.includes("Access denied")
        ) {
          navigate("/forbidden");
          return { success: false, errors: ["Access Denied"] };
        }

        return errorHandler ? errorHandler(formattedError) : formattedError;
      }
    },
    [navigate]
  );
  const apiValue = useMemo(() => ({ callApi }), [callApi]);

  return <ApiContext.Provider value={apiValue}>{children}</ApiContext.Provider>;
};
