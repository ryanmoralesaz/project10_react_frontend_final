import { useNavigate } from "react-router-dom";

export default function TestButtons() {
  const navigate = useNavigate();
  const testForbidden = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test-forbidden");
      if (response.status === 403) {
        navigate("/forbidden");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const testError = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test-error");
      if (response.status === 500) {
        navigate("/error");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/error");
    }
  };

  return (
    <>
      <button onClick={testForbidden}>Test Forbidden</button>
      <button onClick={testError}>Test Error </button>
    </>
  );
}
