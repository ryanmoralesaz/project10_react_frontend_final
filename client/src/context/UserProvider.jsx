import { useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);
  const [courses, setCourses] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const updateAuthUser = useCallback((user) => {
    if (user) {
      const authUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,
      };
      console.log("updating auth user:", authUser);
      setAuthUser(authUser);
      Cookies.set("authenticatedUser", JSON.stringify(authUser), {
        expires: 1,
      });
    } else {
      setAuthUser(null);
      Cookies.remove("authenticatedUser");
    }
  }, []);

  const signIn = useCallback(
    async (credentials) => {
      const encodedCreds = btoa(`${credentials.email}:${credentials.password}`);
      const response = await fetch("http://localhost:5000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCreds}`,
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const user = await response.json();
        updateAuthUser({ ...user, password: credentials.password });
        return user;
      } else if (response.status === 401) {
        return {
          errors: ["User does not exist or credentials are incorrect."],
        };
      } else {
        return {
          errors: ["Failed to authenticate"],
        };
      }
    },
    [updateAuthUser]
  );

  const signUp = useCallback(
    async (userData) => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          return await signIn({
            email: userData.emailAddress,
            password: userData.password,
          });
        } else if (response.status === 400) {
          const data = await response.json();
          return {
            errors: data.errors || ["An error occurred during sign up."],
          };
        } else {
          return { errors: ["Failed to sign up"] };
        }
      } catch (error) {
        console.error("Error signing up:", error);
        return { errors: ["An unexpected error occurred"] };
      }
    },
    [signIn]
  );

  const signOut = useCallback(() => {
    updateAuthUser(null);
  }, [updateAuthUser]);

  const [lastFetchTime, setLastFetchTime] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const fetchCourses = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (!force && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
        console.log("Using cached courses data");
        return;
      }
      if (isFetching) return;
      setIsFetching(true);
      try {
        const response = await fetch(
          ` http://localhost:5000/api/courses?_=${now}`
        );

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCourses(data);
            setLastFetchTime(now);
          } else {
            console.error("data is not an array", data);
          }
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [isFetching, lastFetchTime, CACHE_DURATION]
  );

  const fetchCourse = useCallback(async (id) => {
    const response = await fetch(`http://localhost:5000/api/courses/${id}`);

    const { success, error } = handleErrors(response);
    if (!success) {
      return { success, error };
    }
    const data = await response.json();
    console.log("fetched course data", data);
    return { success: true, course: data };
  }, []);

  const deleteCourse = useCallback(
    async (id) => {
      if (!authUser) return false;
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
        console.log("Delete response status", response.status);
        if (response.status === 204) {
          setCourses((prevCourses) =>
            prevCourses.filter((course) => course.id !== id)
          );
          return true;
        } else {
          const errorData = await response.json();
          console.error("Delete error", errorData);
          return false;
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        return false;
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
          console.log("location header is ", locationHeader);
          if (locationHeader) {
            const newCourseId = locationHeader.split("/").pop();
            return { success: true, errors: newCourseId };
          } else {
            return { success: true };
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

      // setCourses((prevCourses) => [...prevCourses, newCourse]);
    },
    [authUser]
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
      authUser,
      courses,
      actions: {
        signIn,
        signUp,
        signOut,
        updateAuthUser,
        fetchCourse,
        fetchCourses,
        deleteCourse,
        addCourse,
        updateCourse,
      },
    }),
    [
      authUser,
      courses,
      signIn,
      signUp,
      signOut,
      updateAuthUser,
      fetchCourse,
      fetchCourses,
      deleteCourse,
      addCourse,
      updateCourse,
    ]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
export default UserContext;
