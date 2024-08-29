import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import CourseCreate from "./components/CourseCreate";
import CourseUpdate from "./components/CourseUpdate";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PageWrapper from "./components/PageWrapper";
import NotFound from "./components/NotFound";
import Forbidden from "./components/Forbidden";
import UnhandledError from "./components/UnhandledError";
// import MainComponent from "./components/MainComponent";

function App() {
  return (
    <>
      <Header />
      {/* <MainComponent /> */}
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route element={<PrivateRoute />}>
          <Route path="/courses/create" element={<CourseCreate />} />
          <Route path="/courses/:id/update" element={<CourseUpdate />} />
        </Route>
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route
          path="/sign-in"
          element={
            <PageWrapper className="form--centered" title="Sign In">
              <SignIn />
            </PageWrapper>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PageWrapper className="form--centered" title="Sign Up">
              <SignUp />
            </PageWrapper>
          }
        />

        <Route path="/notFound" element={<NotFound />} />

        <Route path="/forbidden" element={<Forbidden />} />

        <Route path="/error" element={<UnhandledError />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
    </>
  );
}

export default App;
