import React from "react";

class AboutPage extends React.Component {
  render() {
    return (
      <>
        <h2>About</h2>
        <p>This app is a React app!</p>
      </>
    );
  }
}

export default AboutPage;

// React.Fragment doesn't render anything!  Shorthand for it is <>
