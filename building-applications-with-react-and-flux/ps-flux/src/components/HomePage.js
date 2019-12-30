import React from "react";

function HomePage() {
  // uppercase indicates a component
  return (
    <div className="jumbotron">
      <h1>Pluralsite Administration</h1>
      <p>React, Flux, and React Router for ultra-response web apps.</p>
      <a href="/about">About</a>
    </div>
  );
}

// because everything is private
export default HomePage;
