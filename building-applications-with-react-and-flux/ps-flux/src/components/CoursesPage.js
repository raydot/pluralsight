import React, { useState, useEffect } from "react";
// Refactor to use a function component and useState and useEffect hooks.
// Notice the wonderful disappearance of "this"
import { getCourses } from "../api/courseApi";

function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Underscore to avoid naming collision.
    getCourses().then(_courses => setCourses(_courses));
  }, []); // <- Dependency array to tell useEffect when to re-run. Empty array = run one time

  // Render is implied in a function component.  Whatever we return is rendered.
  return (
    <>
      <h2>Courses</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author Id</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => {
            return (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.authorId}</td>
                <td>{course.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default CoursesPage;
