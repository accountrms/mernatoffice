import "react";
import axios from "axios";

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    var data = {
      token: localStorage.getItem("token")
    };
    axios.post("/authenticateUser", { data }).then(res => {
      if (res.data.status) {
        this.isAuthenticated = true;
        cb();
      }
    });
  },
  reauthenticate(cb) {
    this.isAuthenticated = true;
    cb();
  },
  signout(cb) {
    this.isAuthenticated = false;
    localStorage.removeItem("token");
    setTimeout(cb, 100);
  }
};

export default fakeAuth;
