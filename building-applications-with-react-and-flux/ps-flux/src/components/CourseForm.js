import React from "react";
import TextInput from "./common/TextInput";
import { PropTypes } from "prop-types";

/**
 *
 * Controlled Components:
 * Any <input> with a value is a controlled component.
 *
 * It's controlled by react so that the Element's value always matches the value of the assigned prop.
 *
 * If the input doesn't have a value prop, it's uncontrolled.
 *
 */

function CourseForm(props) {
  // value of select is a prop (no "select option"), slight difference between JSX and HTML
  return (
    <form onSubmit={props.onSubmit}>
      <TextInput
        id="title"
        label="Title"
        onChange={props.onChange}
        name="title"
        value={props.course.title}
        error={props.errors.title}
      />

      <div className="form-group">
        <label htmlFor="author">Author</label>
        <div className="field">
          <select
            id="author"
            name="authorId"
            onChange={props.onChange}
            value={props.course.authorId || ""}
            className="form-control"
          >
            <option value="" />
            <option value="1">Bugs Bunny</option>
            <option value="2">Daffy Duck</option>
          </select>
        </div>
        {props.errors.authorId && (
          <div className="alert alert-danger">{props.errors.authorId}</div>
        )}
      </div>

      <TextInput
        id="category"
        label="Category"
        name="category"
        onChange={props.onChange}
        value={props.course.category}
        error={props.errors.category}
      />

      <input type="submit" value="Save" className="btn btn-primary" />
    </form>
  );
}

// So devs can see what's expected.
CourseForm.propTypes = {
  courses: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default CourseForm;
