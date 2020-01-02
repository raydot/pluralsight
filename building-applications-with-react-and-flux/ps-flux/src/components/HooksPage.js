import React, { useState, useEffect } from "react";

/**
 * Three hooks you use the most:
 *  useState -- Local State
 *  useEffect -- Handing Side Effects
 *  useContext -- Access Data In Context
 */

// useState
// Hooks only work with functional component.
function UseStateExample() {
  // declare a piece of state called "email"
  // and setter called "setEmail" initialed to empty string
  // using JS array destructuring

  // You can have multiple useState calls per component.
  const [email, setEmail] = useState(""); // returns an array

  return (
    <input
      type="text"
      value={email} // set value of email
      onChange={event => setEmail(event.target.value)} // set with setter, note you don't set with setState
    />
  );
}

// useRender
// called on every remnder
function UseRenderExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // dependencies.  Must list or you get side effects.

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
