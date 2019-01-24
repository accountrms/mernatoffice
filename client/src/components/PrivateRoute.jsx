import React from "react";
import { Route, Redirect } from "react-router-dom";
import fakeAuth from "../helpers/fakeAuth";

function PrivateRoute({ component: Component, id, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
          <Component id={id} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
