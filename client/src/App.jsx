import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import CourseCreate from "./components/CourseCreate";
import CourseUpdate from "./components/CourseUpdate";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
// import MainComponent from "./components/MainComponent";

function App() {
  return (
    <Router>
      <Header />
      {/* <MainComponent /> */}
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/create" element={<CourseCreate />} />
        <Route path="/courses/:id/update" element={<CourseUpdate />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
