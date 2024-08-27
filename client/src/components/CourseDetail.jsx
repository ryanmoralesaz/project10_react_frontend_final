import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import Error from "./Error";
import ActionsBar from "./ActionsBar";
import UserContext from "../context/UserContext";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser, actions } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("fetched data", data);
        setCourse(data);
        setLoading(false);
      } catch (e) {
        setError(`Failed to fetch courses error:${e.message}`);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  const handleDelete = async () => {
    const success = await actions.deleteCourse(id);
    if (success) {
      navigate("/");
    } else {
      setError("Failed to delete course");
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <Error errorMessage={error} />;
  return (
    <>
      <ActionsBar
        courseId={id}
        courseUserId={course.User.id}
        onDelete={handleDelete}
        isOwner={authUser && authUser.id === course.User.id}
      />
      <div className="form--centered">
        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>
              <p>
                By {course.User.firstName} {course.User.lastName}{" "}
              </p>
              <ReactMarkdown className="course-description">
                {course.description}
              </ReactMarkdown>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{course.estimatedTime}</p>

              <h3 className="course--detail--title">Materials Needed</h3>
              <ReactMarkdown className="course--materials">
                {course.materialsNeeded}
              </ReactMarkdown>

              {/* <ul className="course--detail--list">
            {materialItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul> */}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
