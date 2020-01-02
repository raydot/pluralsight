import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  // uppercase indicates a component
  return (
    <div className="jumbotron">
      <h1>Pluralsite Administration</h1>
      <p>React, Flux, and React Router for ultra-response web apps.</p>
      <Link to="about" className="btn btn-primary">
        About
      </Link>
    </div>
  );
}

// because everything is private
export default HomePage;
