import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

class Home extends Component {
  state = {
    trackingAll: [],
    search: "",
    searchStatus: "",
    id: ""
  };

  componentDidMount() {
    var data = {
      token: localStorage.getItem("token"),
      searchStatus: false
    };
    axios.post("/getposts", { data }).then(response => {
      this.setState({
        trackingAll: response.data.results,
        searchStatus: false,
        id: response.data.authData.data.id
      });
    });
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    var data = {
      token: localStorage.getItem("token"),
      search: this.state.search,
      searchStatus: true
    };
    axios.post("getposts", { data }).then(response => {
      this.setState({
        trackingAll: response.data.results,
        searchStatus: true
      });
    });
  };

  render() {
    var trackingList = this.state.trackingAll.map(tracking => {
      return (
        <tr key={tracking.id}>
          <td>{tracking.reqno}</td>
          <td>{tracking.vendor}</td>
          <td>{tracking.orderno}</td>
          <td>{tracking.invoice}</td>
          <td>
            {tracking.date.substr(8, 2) +
              "/" +
              tracking.date.substr(5, 2) +
              "/" +
              tracking.date.substr(0, 4)}
          </td>
          <td>{tracking.amount}</td>
          <td>
            {tracking.processed === 0 ? (
              this.state.id === "admin" ? (
                <Link to={"/generate/" + tracking.id} className="btn">
                  Add
                </Link>
              ) : (
                <b>Pending</b>
              )
            ) : (
              tracking.tracking
            )}
          </td>
        </tr>
      );
    });

    return (
      <div className="container">
        {this.state.trackingAll.length !== 0 ? (
          <React.Fragment>
            <SearchBar
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
            />

            <table className="highlight">
              <thead>
                <tr>
                  <th>Request No.</th>
                  <th>Vendor No.</th>
                  <th>Order No.</th>
                  <th>Invoice No.</th>
                  <th>Invoice Date</th>
                  <th>Invoice Amount</th>
                  <th>Tracking No.</th>
                </tr>
              </thead>
              <tbody>{trackingList}</tbody>
            </table>
          </React.Fragment>
        ) : this.state.searchStatus ? (
          <React.Fragment>
            <SearchBar
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
            />
            <h5>Nothing found! Try again with correct request number </h5>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h4>No request yet! </h4>
            <h5>
              Go to <Link to="/ims">Request</Link> to create new request
            </h5>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Home;
