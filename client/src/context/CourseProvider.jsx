import { useState, useCallback, useMemo } from "react";
import { CourseContext } from "./Context";
import { useAuth, useApi } from "./useContext";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CourseProvider = ({ children }) => {
  // console.log("API_BASE_URL:", API_BASE_URL);
  const { authUser } = useAuth();
  const { callApi } = useApi();
  const [courses, setCourses] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const fetchCourses = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (!force && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
        console.log("Using cached courses data", courses);
        return { success: true, courses }; // Return cached data with success flag
      }
      if (isFetching) return { success: false, error: "Already fetching" };
      setIsFetching(true);
      try {
        const result = await callApi(
          async () => {
            const response = await fetch(
              `http://localhost:5000/api/courses?_=${now}`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch courses");
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
              throw new Error("Invalid data format");
            }

            setCourses(data);
            setLastFetchTime(now);
            return { success: true, courses: data };
          },
          (error) => {
            console.error("Error fetching courses:", error);
            return { success: false, error: error.message };
          }
        );
        return result; // Ensure we always return a result
      } finally {
        setIsFetching(false);
      }
      // return await callApi(
      //   async () => {
      //     const response = await fetch(
      //       `http://localhost:5000/api/courses?_=${now}`
      //     );
      //     if (!response.ok) {
      //       throw new Error("Failed to fetch courses");
      //     }

      //     const data = await response.json();
      //     if (!Array.isArray(data)) {
      //       throw new Error("Invalid data format");
      //     }

      //     setCourses(data);
      //     setLastFetchTime(now);
      //     return { success: true, courses: data };
      // if (response.ok) {
      //   const data = await response.json();
      //   if (Array.isArray(data)) {
      //     setCourses(data);
      //     setLastFetchTime(now);
      //     setIsFetching(false);
      //     return { success: true, courses: data }
      //   } else {
      //     console.error("data is not an array", data);
      //     setCourses([]);
      //     setIsFetching(false);
      //     return { success: false, error: "Invalid data format" };
      //   }
      // } else {
      //   throw new Error("Failed to fetch courses");
      // }
      // },
      // (error) => {
      //   console.error("Error fetching courses:", error);
      //   return { success: false, error: error.message };
      //   // setCourses([]);
      // }
      // );

      // setIsFetching(false);
    },
    [isFetching, lastFetchTime, CACHE_DURATION, courses, callApi]
  );

  const fetchCourse = useCallback(
    async (id) => {
      return await callApi(
        async () => {
          const response = await fetch(
            `http://localhost:5000/api/courses/${id}`
          );
          if (response.status === 404) {
            return { success: false, error: "Course not found" };
          }
          if (!response.ok) {
            throw new Error("Failde to fetch course");
          }
          const data = await response.json();
          return { success: true, course: data };
        },
        (error) => {
          return {
            success: false,
            error: error.message || "Failed to fetch course",
          };
        }
      );
    },
    [callApi]
  );

  const deleteCourse = useCallback(
    async (id) => {
      console.log(`Attempting to delete course with id: ${id}`);
      if (!authUser) return { success: false, error: "User not authenticated" };
      return await callApi(
        async () => {
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
            console.log(`Course ${id} deleted successfully`);
            setCourses((prevCourses) => {
              const newCourses = prevCourses.filter(
                (course) => course.id !== parseInt(id)
              );
              console.log("Updated courses after deletion:", newCourses);
              return newCourses;
            });
            return { success: true };
          } else {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "An error occurred while deleting the course"
            );
          }
        },
        (error) => {
          console.error(`Error deleting course ${id}:`, error);
          return {
            success: false,
            error:
              error.message || "An error occurred while deleting the course",
          };
        }
      );
    },
    [authUser, callApi]
  );
  const addCourse = useCallback(
    async (newCourse) => {
      if (!authUser) {
        return { success: false, errors: ["User not authenticated"] };
      }
      try {
        const result = await callApi(
          async () => {
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
            const data = await response.json();
            if (response.status === 201) {
              setCourses((prevCourses) => [...prevCourses, data]);
              return { success: true, courseId: data.id };
            } else if (response.status === 400) {
              return {
                success: false,
                errors: data.errors || ["Validation failed"],
              };
            } else {
              throw new Error(data.message || "An unknown error occurred");
            }
          },
          (errors) => {
            return {
              success: false,
              errors: errors,
            };
          }
        );

        if (result.success) {
          await fetchCourses(true);
        }

        return result;
      } catch (error) {
        console.error("Error in addCourse:", error);
        return {
          success: false,
          errors: Array.isArray(error)
            ? error
            : [error.message || "An unknown error occurred"],
        };
      }
    },
    [authUser, callApi, fetchCourses]
  );

  const updateCourse = useCallback(
    async (id, courseData) => {
      if (!authUser)
        return { success: false, errors: ["User not authenticated"] };
      return await callApi(
        async () => {
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
            setCourses((prevCourses) =>
              prevCourses.map((course) =>
                course.id === id ? { ...course, ...courseData } : course
              )
            );
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
            const data = await response.json();
            return {
              success: false,
              errors: [data.message || "An unknown error occurred"],
            };
          }
        },
        (errors) => {
          return {
            success: false,
            errors: errors,
          };
        }
      );
    },
    [authUser, callApi, setCourses]
  );

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
