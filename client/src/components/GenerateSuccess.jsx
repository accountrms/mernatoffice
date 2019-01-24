import React from "react";
import { Link } from "react-router-dom";

const GenerateSuccess = () => {
  return (
    <div className="container">
      <h5>The tracking number has been successfully added to the request</h5>
      <h6>
        Navigate to <Link to="/">Home</Link>
      </h6>
    </div>
  );
};

export default GenerateSuccess;
