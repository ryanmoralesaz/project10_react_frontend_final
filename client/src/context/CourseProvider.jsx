import { useState, useCallback, useMemo } from "react";
import { CourseContext } from "./Context";
import { useAuth, useApi } from "./useContext";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const CourseProvider = ({ children }) => {
  const { authUser } = useAuth();
  const { callApi } = useApi();
  const [courses, setCourses] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchCourses = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (!force && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
        return { success: true, courses };
      }
      if (isFetching) return { success: false, errors: ["Already fetching"] };
      setIsFetching(true);
      try {
        const result = await callApi(async () => {
          const response = await fetch(
            `http://localhost:5000/api/courses?_=${now}`
          );
          if (!response.ok) {
            throw {
              status: response.status,
              errors: [`HTTP error! status: ${response.status}`],
            };
          }
          const data = await response.json();
          setCourses(data);
          setLastFetchTime(now);
          return { success: true, courses: data };
        });
        return result;
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
        if (!response.ok) {
          throw {
            status: response.status,
            errors: [`HTTP error! status: ${response.status}`],
          };
        }
        const data = await response.json();
        return { success: true, course: data };
      });
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
        throw {
          status: response.status,
          errors: [`HTTP error! status: ${response.status}`],
        };
      });
    },
    [authUser, callApi]
  );

  const addCourse = useCallback(
    async (newCourse) => {
      if (!authUser) {
        return { success: false, errors: ["User not authenticated"] };
      }
      return await callApi(async () => {
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
            status: response.status,
            errors: errorData.errors || [
              errorData.mesage || "An unknown error occurred",
            ],
          };
        }

        const data = await response.json();
        setCourses((prevCourses) => [...prevCourses, data]);
        return { success: true, courseId: data.id };
      });
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
              )}`,
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
        }
        const errorData = await response.json();
        throw {
          status: response.status,
          errors: errorData.errors || [errorData.message] || [
              "An unknown error occurred",
            ],
        };
      });
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
