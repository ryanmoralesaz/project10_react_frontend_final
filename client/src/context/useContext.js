import { useContext } from "react";
import { AuthContext, CourseContext, ApiContext } from "./Context";
const useAuth = () => useContext(AuthContext);
const useCourse = () => useContext(CourseContext);
const useApi = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context
};
export { useAuth, useCourse, useApi }