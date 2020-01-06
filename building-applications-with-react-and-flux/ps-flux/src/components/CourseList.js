// "Dumb" container
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Send array to props and it returns a table.
// All dependencies sent via props
// Hence: dumb and incredibly flexible component
function CourseList(props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>Title</th>
          <th>Author Id</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {props.courses.map(course => {
          return (
            <tr key={course.id}>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => props.deleteCourse(course.id)}
                >
                  Delete
                </button>
              </td>
              <td>
                <Link to={"/course/" + course.slug}>{course.title}</Link>
              </td>
              <td>{course.authorId}</td>
              <td>{course.category}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// Proptypes only checked in development
CourseList.propTypes = {
  deleteCourse: PropTypes.func.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      authorId: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired
    })
  ).isRequired
};

// Default to an empty array
CourseList.defaultProps = {
  courses: []
};

export default CourseList;
