import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import CourseCreate from "./components/CourseCreate";
import CourseUpdate from "./components/CourseUpdate";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ErrorNotFound from "./components/ErrorNotFound";
import ErrorForbidden from "./components/ErrorForbidden";
import ErrorUnhandled from "./components/ErrorUnhandled";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route element={<PrivateRoute />}>
          <Route path="/courses/create" element={<CourseCreate />} />
          <Route path="/courses/:id/update" element={<CourseUpdate />} />
        </Route>
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/notFound" element={<ErrorNotFound />} />

        <Route path="/forbidden" element={<ErrorForbidden />} />

        <Route path="/error" element={<ErrorUnhandled />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
    </>
  );
}

export default App;
