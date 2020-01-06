import React, { useState, useEffect } from "react";
//import { getCourses } from "../api/courseApi";
import courseStore from "../stores/courseStore";
import CourseList from "./CourseList";
import { Link } from "react-router-dom";
import { loadCourses, deleteCourse } from "../actions/courseActions";

function CoursesPage() {
  const [courses, setCourses] = useState(courseStore.getCourses);

  useEffect(() => {
    courseStore.addChangeListener(onChange);
    //getCourses().then(_courses => setCourses(_courses));
    if (courseStore.getCourses().length === 0) loadCourses();
    return () => courseStore.removeChangeListener(onChange); // cleanup on unmount
  }, []);

  // Get list of courses and update state
  function onChange() {
    setCourses(courseStore.getCourses());
  }

  // This "smart" component is now focused only on passing the data
  return (
    <>
      <h2>Courses</h2>
      <Link className="btn btn-primary" to="/course">
        Add Course
      </Link>
      <CourseList courses={courses} deleteCourse={deleteCourse} />
    </>
  );
}

export default CoursesPage;
