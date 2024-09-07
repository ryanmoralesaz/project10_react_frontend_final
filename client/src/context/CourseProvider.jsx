import { useState, useCallback, useMemo } from "react";
import { CourseContext } from "./Context";
import { useAuth, useApi } from "./useContext";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const CourseProvider = ({ children }) => {
  // console.log("API_BASE_URL:", API_BASE_URL);
  const { authUser } = useAuth();
  const { callApi } = useApi();
  const [courses, setCourses] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const handleApiError = (error) => {
    console.error("API Error:", error);
    return error.error || error;
  };

  const fetchCourses = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (!force && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
        return { success: true, courses };
      }
      if (isFetching) return { success: false, errors: ["Already fetching"] };
      setIsFetching(true);
      try {
        return await callApi(async () => {
          const response = await fetch(
            `http://localhost:5000/api/courses?_=${now}`
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
          }
          const data = await response.json();
          setCourses(data);
          setLastFetchTime(now);
          return { success: true, courses: data };
        });
      } catch (error) {
        return {
          success: false,
          errors: [error.message || "An unknown error occured"],
        };
      } finally {
        setIsFetching(false);
      }
    },
    [isFetching, lastFetchTime, courses, callApi]
  );

  const fetchCourse = useCallback(
    async (id) => {
      return await callApi(async () => {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (response.status === 500) {
          throw { success: false, errors: ["500 Internal Server Error"] };
        }
        if (response.status === 404) {
          return { success: false, errors: ["Course not found"] };
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw errorData.errors || ["Failed to fetch course"];
        }
        const data = await response.json();
        return { success: true, course: data };
      }, handleApiError);
    },
    [callApi]
  );

  const deleteCourse = useCallback(
    async (id) => {
      if (!authUser)
        return { success: false, errors: ["User not authenticated"] };
      return await callApi(async () => {
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
            prevCourses.filter((course) => course.id !== parseInt(id))
          );
          return { success: true };
        }
        if (response.status === 500) {
          throw { success: false, errors: ["500 Internal Server Error"] };
        }
        if (response.status === 404) {
          return { success: false, errors: ["Course not found"] };
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw (
            errorData.errors || ["An error occurred while deleting the course"]
          );
        }
      }, handleApiError);
    },
    [authUser, callApi]
  );

  // const addCourse = useCallback(
  //   async (newCourse) => {
  //     if (!authUser) {
  //       return { success: false, errors: ["User not authenticated"] };
  //     }
  //     return await callApi(async () => {
  //       const response = await fetch(`http://localhost:5000/api/courses`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Basic ${btoa(
  //             `${authUser.emailAddress}:${authUser.password}`
  //           )}`,
  //         },
  //         body: JSON.stringify(newCourse),
  //       });
  //       const data = await response.json();
  //       if (response.ok) {
  //         setCourses((prevCourses) => [...prevCourses, data]);
  //         return { success: true, courseId: data.id };
  //       } else {
  //         throw {
  //           success: false,
  //           errors: data.errors || ["An unknown error occurred"],
  //         };
  //       }
  //     }, handleApiError);
  //   },
  //   [authUser, callApi]
  // );
  const addCourse = useCallback(
    async (newCourse) => {
      if (!authUser) {
        return { success: false, errors: ["User not authenticated"] };
      }
      return await callApi(
        async () => {
          const response = await fetch(`http://localhost:5000/api/courses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(
                `${authUser.emailAddress}:${authUser.password}`
              )}`,
            },
            body: JSON.stringify(newCourse),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw {
              success: false,
              errors: errorData.errors || ["An unknown error occurred"],
              status: response.status,
            };
          }

          const data = await response.json();
          setCourses((prevCourses) => [...prevCourses, data]);
          return { success: true, courseId: data.id };
        },
        handleApiError
        // (error) => {
        //   console.error("Error adding course:", error);
        //   return {
        //     success: false,
        //     errors: error.errors || ["An unknown error occurred"],
        //   };
        // }
      );
    },
    [authUser, callApi]
  );
  const updateCourse = useCallback(
    async (id, courseData) => {
      if (!authUser)
        return { success: false, errors: ["User not authenticated"] };
      return await callApi(async () => {
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
        } else {
          const errorData = await response.json();
          throw {
            success: false,
            errors: errorData.errors || ["An unknown error occcurred"],
          };
        }
      }, handleApiError);
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
