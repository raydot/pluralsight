import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <h2>404 -- 404 -- 404</h2>
      <h3>No page for you, loser!</h3>
      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
