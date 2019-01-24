import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Request from "./components/Request";
import Notfound from "./components/Notfound";
import Tracking from "./components/Tracking";
import RequestSuccess from "./components/RequestSuccess";
import GenerateSuccess from "./components/GenerateSuccess";

class App extends Component {
  state = {
    user: "",
    id: ""
  };

  handleUser = data => {
    this.setState({
      user: data.user,
      id: data.id
    });
  };

  render() {
    return (
      <Router>
        <div>
          <Navbar data={this.state} />
          <Switch>
            <PrivateRoute exact path="/" component={Home} id={this.state.id} />
            <Route
              path="/login"
              render={props => <Login {...props} onUser={this.handleUser} />}
            />
            <PrivateRoute path="/ims" component={Request} />
            <PrivateRoute path="/generate/:ims_id" component={Tracking} />
            <PrivateRoute path="/reqsuccess" component={RequestSuccess} />
            <PrivateRoute path="/gensuccess" component={GenerateSuccess} />
            <Route component={Notfound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
