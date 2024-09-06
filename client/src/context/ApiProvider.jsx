import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "./Context";

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();
  const callApi = useCallback(
    async (apiFunction, errorHandler, ...args) => {
      try {
        const result = await apiFunction(...args);
        if (!result.success && result.status === 500) {
          navigate("/error");
          return { success: false, errors: ["Internal Server Error"] };
        }
        // Handle 404 errors (Not Found)
        if (
          !result.success &&
          result.errors &&
          result.errors.includes("Course not found")
        ) {
          navigate("/notfound");
          return { success: false, errors: ["Course not found"] };
        }

        // Handle 403 errors (Forbidden)
        if (!result.success && result.status === 403) {
          navigate("/forbidden");
          return { success: false, errors: ["Access Denied"] };
        }
        return result;
      } catch (error) {
        // Handle unexpected errors
        const formattedError = {
          success: false,
          errors: error.errors || [
            error.message || "An unknown error occurred",
          ],
        };

        // Handle 500 error or any error containing "Internal Server Error"
        if (
          error.status === 500 ||
          (error.errors &&
            error.errors.some((e) => e.includes("Internal Server Error")))
        ) {
          navigate("/error");
          return { success: false, errors: ["Internal Server Error"] };
        }

        // Handle 404 errors
        if (
          error.status === 404 ||
          (error.errors && error.errors.includes("Course not found"))
        ) {
          navigate("/notfound");
          return { success: false, errors: ["Course not found"] };
        }

        // Handle 403 errors
        if (
          error.status === 403 ||
          (error.errors && error.errors.includes("Access denied"))
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
