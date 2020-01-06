import { EventEmitter } from "events"; // al
import Dispatcher from "../appDispatcher";
import actionTypes from "../actions/actionTypes";

/**
 * Every flux store should have these three functions:
 * 1.  addChangeListener(wraps on)
 * 2.  removeChangeListener (wraps removeListener)
 * 3.  emitChange (wraps emit)
 */
const CHANGE_EVENT = "change";
let _courses = [];

class CourseStore extends EventEmitter {
  addChangeListener(callback) {
    // allow components to subscribe to store change
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    // allow components to unsubscribe
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  getCourses() {
    return _courses;
  }

  getCourseBySlug(slug) {
    return _courses.find(course => course.slug === slug); // find returns a predicate
  }
}

const store = new CourseStore();

Dispatcher.register(action => {
  switch (action.actionType) {
    case actionTypes.CREATE_COURSE:
      _courses.push(action.course);
      store.emitChange(); // any time store changes, this notifies everyone and everything...
      break;
    case actionTypes.UPDATE_COURSE:
      _courses = _courses.map(course =>
        course.id === action.course.id ? action.course : course
      );
      store.emitChange();
      break;
    case actionTypes.LOAD_COURSES:
      _courses = action.courses;
      store.emitChange();
      break;
    case actionTypes.DELETE_COURSE:
      _courses = _courses.filter(
        course => course.id !== parseInt(action.id, 10)
      );
      store.emitChange();
      // could fire off more actions if you wanted, say, a progress indicator
      break;
    default:
    // nothing for this store to do!
  }
});

export default store;
