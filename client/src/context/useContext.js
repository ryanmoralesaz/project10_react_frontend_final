import { useContext } from "react";
import { AuthContext, CourseContext, ApiContext } from "./Context";
const useAuth = () => useContext(AuthContext);
const useCourse = () => useContext(CourseContext);
const useApi = () => useContext(ApiContext);
export { useAuth, useCourse, useApi }