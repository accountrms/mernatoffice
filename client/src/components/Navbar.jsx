import React from "react";
import { NavLink, withRouter, Link } from "react-router-dom";
import fakeAuth from "../helpers/fakeAuth";

var Navbar = props => {
  return (
    <nav>
      <div className="nav-wrapper container">
        <Link to="/" className="brand-logo">
          <img src="logo.png" alt="logo" />
          <span className="right">IMS Request App</span>
        </Link>
        <ul className="right">
          <li>
            <NavLink exact={true} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/ims">Request</NavLink>
          </li>
          <li>
            {fakeAuth.isAuthenticated ? (
              <button
                className="btn btn-flat white-text"
                onClick={() => {
                  fakeAuth.signout(() => props.history.push("/"));
                }}
              >
                Sign out ({props.data.user})
              </button>
            ) : null}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
