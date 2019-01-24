import React from "react";
import { NavLink, withRouter, Link } from "react-router-dom";
import fakeAuth from "../helpers/fakeAuth";

var Navbar = props => {
  return (
    <nav>
      <div className="nav-wrapper container">
        <Link to="/" class="brand-logo">
          <img src="logo.png" alt="logo" />
          <x className="right">IMS Request App</x>
        </Link>
        <ul className="right">
          <li>
            <NavLink to="/">Home</NavLink>
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
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
