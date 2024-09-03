import { useState, useCallback, useMemo } from "react";
import { CourseContext } from "./Context";
import { useAuth } from "./useContext";

export const CourseProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const fetchCourses = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (!force && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
        console.log("Using cached courses data", courses);
        return;
      }
      if (isFetching) return;
      setIsFetching(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses?_=${now}`
        );

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCourses(data);
            setLastFetchTime(now);
          } else {
            console.error("data is not an array", data);
            setCourses([]);
          }
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setIsFetching(false);
      }
    },
    [isFetching, lastFetchTime, CACHE_DURATION, courses]
  );

  const fetchCourse = useCallback(async (id) => {
    const response = await fetch(`http://localhost:5000/api/courses/${id}`);

    const { success, error } = handleErrors(response);
    if (!success) {
      return { success, error };
    }
    const data = await response.json();
    return { success: true, course: data };
  }, []);

  const deleteCourse = useCallback(
    async (id) => {
      if (!authUser) return { success: false, error: "User not authenticated" };
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${btoa(
                `${authUser.emailAddress}:${authUser.password}`
              )}`,
            },
          }
        );
        if (response.status === 204) {
          setCourses((prevCourses) =>
            prevCourses.filter((course) => course.id !== id)
          );
          return { success: true };
        } else {
          const errorData = await response.json();
          console.error("Delete error", errorData);
          return {
            success: false,
            error:
              errorData.message ||
              "An error occurred while deleting the course",
          };
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        return {
          success: false,
          error: error.message || "An error occurred while deleting the course",
        };
      }
    },
    [authUser]
  );
  const updateCourse = useCallback(
    async (id, courseData) => {
      if (!authUser)
        return { success: false, errors: ["User not authenticated"] };
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(
                `${authUser.emailAddress}:${authUser.password}`
              )} `,
            },
            body: JSON.stringify(courseData),
          }
        );
        if (response.status === 204) {
          setCourses((prevCourses) => {
            prevCourses.map((course) =>
              course.id === id ? { ...course, ...courseData } : course
            );
          });
          return { success: true };
        } else if (response.status === 400) {
          const data = await response.json();
          return { success: false, errors: data.errors };
        } else if (response.status === 403) {
          return {
            success: false,
            errors: [
              "Access denied. You don't have permission to update this course.",
            ],
          };
        } else {
          return { success: false, erros: ["An unknown error occurred"] };
        }
      } catch (error) {
        console.error("error updating course", error);
        return { success: false, errors: [error.message] };
      }
    },
    [authUser]
  );
  const addCourse = useCallback(
    async (newCourse) => {
      if (!authUser) {
        return { success: false, errors: ["User not authenticated"] };
      }
      try {
        let encodedCreds = btoa(
          `${authUser.emailAddress}:${authUser.password}`
        );
        const response = await fetch(`http://localhost:5000/api/courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCreds}`,
          },
          body: JSON.stringify(newCourse),
        });
        if (response.status === 201) {
          const locationHeader = response.headers.get("Location");
          const newCourseId = locationHeader
            ? locationHeader.split("/").pop()
            : null;

          const courseDetailsResponse = await fetch(
            `http://localhost:5000/api/courses/${newCourseId}`,
            {
              headers: { Authorization: `Basic ${encodedCreds}` },
            }
          );

          if (courseDetailsResponse.ok) {
            const courseDetails = await courseDetailsResponse.json();
            setCourses((prevCourses) => [...prevCourses, courseDetails]);
            return { success: true, courseId: newCourseId };
          } else {
            console.warn("Course created but details couldn't be fetched");
            return { success: true, courseId: newCourseId };
          }
        } else if (response.status === 400) {
          const data = await response.json();
          return {
            success: false,
            errors: data.errors || ["Validation failed"],
          };
        } else {
          return { success: false, errors: ["An unknown error occured"] };
        }
      } catch (error) {
        return {
          success: false,
          errors: [error.message],
        };
      }
    },
    [authUser, setCourses]
  );

  const handleErrors = (response) => {
    if (response.status === 401) {
      return { success: false, error: "Unauthorized access" };
    } else if (response.status === 403) {
      return { success: false, error: "Access denied" };
    } else if (response.status === 404) {
      return { success: false, error: "Course not found" };
    } else if (response.status === 500) {
      return { success: false, error: "Internal Server Error" };
    }
    return { success: true };
  };
  const contextValue = useMemo(
    () => ({
      courses,
      actions: {
        fetchCourse,
        fetchCourses,
        deleteCourse,
        addCourse,
        updateCourse,
      },
    }),
    [courses, fetchCourse, fetchCourses, deleteCourse, addCourse, updateCourse]
  );
  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};
