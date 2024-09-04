import { useNavigate } from "react-router-dom";
import { useApi } from "../context/useContext";

export default function TestButtons() {
  const { callApi } = useApi();
  const navigate = useNavigate();
  const testError = async () => {
    await callApi(
      async () => {
        const response = await fetch("http://localhost:5000/api/test-error");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }
        return response;
      },
      (error) => {
        console.error("Error in test component:", error);
        // Navigate to /error route when a 500 error occurs
        if (error.message.includes("500")) {
          navigate("/error"); // Navigate to the UnhandledError component
        }
      }
    );
  };
  return (
    <>
      <button onClick={testError}>Test Error </button>
    </>
  );
}
