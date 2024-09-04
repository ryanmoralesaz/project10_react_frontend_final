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
        return;
      }
      if (isFetching) return;
      setIsFetching(true);
      await callApi(
        async () => {
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
        },
        (error) => {
          console.error("Error fetching courses:", error);
          setCourses([]);
        }
      );

      setIsFetching(false);
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
            setCourses((prevCourses) =>
              prevCourses.filter((course) => course.id !== id)
            );
            return { success: true };
          } else {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "An error occurred while deleting the course"
            );
          }
        },
        (error) => {
          return {
            success: false,
            error:
              error.message || "An error occured while deleting the course",
          };
        }
      );
    },
    [authUser, callApi]
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
            setCourses((prevCourses) => {
              prevCourses.map((course) =>
                course.id === id ? { ...course, ...courseData } : course
              );
            });
            return { success: true };
          } else if (response.status === 400) {
            const data = await response.json();
            throw new Error(JSON.stringify(data.errors));
          } else if (response.status === 403) {
            throw new Error(
              "Access denied. You don't have permission to update this course."
            );
          } else {
            throw new Error("An unknow error occurred");
          }
        },
        (error) => {
          return {
            success: false,
            errors: JSON.parse(error.message) || [error.message],
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
      return await callApi(
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
            throw new Error(
              JSON.stringify(data.errors || ["Validation failed"])
            );
          } else {
            throw new Error("An unknown error occurred");
          }
        },
        (error) => {
          return {
            success: false,
            errors: JSON.parse(error.message) || [error.message],
          };
        }
      );
    },
    [authUser, callApi]
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
