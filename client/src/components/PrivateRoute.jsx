import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const PrivateRoute = () => {
  const { authUser } = useContext(UserContext);
  const location = useLocation();
  if (!authUser) {
    // save the current location the user was trying to navigate to
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }
  return <Outlet />;
};

export default PrivateRoute;
