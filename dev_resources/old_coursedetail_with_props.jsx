import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Error from "./Error";

export default function CourseDetail({
  courseTitle,
  courseAuthor,
  courseTime,
  materialItems,
  courseDescription,
}) {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses`);
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourse(data);
        setLoading(false);
      } catch (e) {
        setError(`Failed to fetch courses error:${e}`);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  return (
    <form>
      <div className="main--flex">
        <div>
          <h3 className="course--detail--title">Course</h3>
          <h4 className="course--name">{courseTitle}</h4>
          <p>By {courseAuthor} </p>

          {courseDescription}
        </div>
        <div>
          <h3 className="course--detail--title">Estimated Time</h3>
          <p>{courseTime}</p>

          <h3 className="course--detail--title">Materials Needed</h3>
          <ul className="course--detail--list">
            {materialItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
}
