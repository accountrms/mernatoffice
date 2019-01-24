import "react";
import axios from "axios";

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    var data = {
      token: localStorage.getItem("token")
    };
    axios.post("/authenticateUser", { data }).then(res => {
      console.log(res.data.status);
      if (res.data.status) {
        cb();
      }
    });
  },
  signout(cb) {
    this.isAuthenticated = false;
    localStorage.removeItem("token");
    setTimeout(cb, 100);
  }
};

export default fakeAuth;
