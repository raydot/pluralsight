import React, { useState, useEffect } from "react";
import CourseForm from "./CourseForm";
//import * as courseApi from "../api/courseApi"; // Using FLUX now!
import courseStore from "../stores/courseStore";
import { toast } from "react-toastify";
import * as courseActions from "../actions/courseActions";

const ManageCoursePage = props => {
  // Declare some state:
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState(courseStore.getCourses());
  const [course, setCourse] = useState({
    // state name = "course", "setCourse" =setter, array = default / empty course
    id: null,
    slug: "",
    title: "",
    authorId: null,
    category: ""
  });

  //   function handleTitleChange(event) {
  //     // ANTIPATTERN: State is immutable.
  //     //course.title = event.target.title;

  //     // Create a copy of the object instead
  //     const updatedCourse = { ...course, title: event.target.value };
  //     setCourse(updatedCourse);
  //   }

  // refactor so we don't have to create a new function for every change!

  useEffect(() => {
    courseStore.addChangeListener(onChange);
    const slug = props.match.params.slug; // pulls from the path /courses/:slug
    if (courses.length === 0) {
      courseActions.loadCourses();
      //courseApi.getCourseBySlug(slug).then(_course => setCourse(_course));
    } else if (slug) {
      setCourse(courseStore.getCourseBySlug(slug));
    }
    return () => courseStore.removeChangeListener(onChange);
  }, [courses.length, props.match.params.slug]); // declare dependency array

  function onChange() {
    setCourses(courseStore.getCourses());
  }

  function handleChange({ target }) {
    //const updateCourse = ;
    setCourse({
      ...course,
      [target.name]: target.value
    });
  }

  // Error checking pattern
  function formIsValid() {
    const _errors = {};

    if (!course.title) _errors.title = "Title is required!";
    if (!course.authorId) _errors.authorId = "Author ID is required!";
    if (!course.category) _errors.category = "Category is required!";

    setErrors(_errors);
    // Form is valid if the errors object has no properties.
    return Object.keys(_errors).length === 0;
  }

  //save the course
  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    //courseApi.saveCourse(course).then(() => {
    // saveCourse returns a promise
    // use React Router history object
    courseActions.saveCourse(course).then(() => {
      props.history.push("/courses");
      toast.success("Course saved.");
    });
  }

  return (
    <>
      <h2>Manage Course</h2>
      <CourseForm
        errors={errors}
        course={course}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ManageCoursePage;
