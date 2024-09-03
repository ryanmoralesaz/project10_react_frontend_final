import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useContext";
const PrivateRoute = () => {
  const { authUser } = useAuth();
  const location = useLocation();
  if (!authUser) {
    // save the current location the user was trying to navigate to
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }
  return <Outlet />;
};

export default PrivateRoute;
