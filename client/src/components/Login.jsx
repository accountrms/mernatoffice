import React from "react";
import { Redirect } from "react-router-dom";
import fakeAuth from "../helpers/fakeAuth";
import axios from "axios";

class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    username: "",
    password: ""
  };

  componentDidMount() {
    var data = {
      token: localStorage.getItem("token")
    };
    if (typeof data.token !== "undefined") {
      axios.post("/authenticateUser", { data }).then(res => {
        console.log(res.data);
        if (res.data.status) {
          this.props.onUser(res.data.data);
          this.relogin();
        } else {
          console.log("error");
        }
      });
    } else {
      console.log("yoyo");
    }
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  relogin = () => {
    fakeAuth.reauthenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    var data = {
      username: this.state.username,
      password: this.state.password
    };
    e.preventDefault();
    axios.post("/login", { data }).then(res => {
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        this.props.onUser(res.data.data);
        this.login();
      } else {
        console.log("error");
      }
    });
  };

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div className="container">
        <div className="row">
          <div className="col s12 m6">
            <form onSubmit={this.handleSubmit}>
              <div className="card">
                <div className="card-content">
                  <span className="card-title">
                    Login with your domain credentials
                  </span>
                  <label htmlFor="username">
                    Username
                    <input
                      onChange={this.handleChange}
                      type="text"
                      name="username"
                      id="username"
                    />
                  </label>
                  <label htmlFor="password">
                    Password
                    <input
                      onChange={this.handleChange}
                      type="password"
                      name="password"
                      id="password"
                    />
                  </label>
                </div>
                <div className="card-action">
                  <button className="btn btn-large">Log in</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
