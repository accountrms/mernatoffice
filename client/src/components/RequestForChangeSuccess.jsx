import React from "react";
import { Link } from "react-router-dom";

const RequestForChangeSuccess = () => {
  return (
    <div className="container">
      <h5>Your request has been updated successfully</h5>
      <h6>We will process your request at the earliest</h6>
      <h6>
        Go to <Link to="/">Home</Link> to check the status of your request
      </h6>
      <h6>
        Go to <Link to="/ims">Request</Link> to create a new request
      </h6>
    </div>
  );
};

export default RequestForChangeSuccess;
