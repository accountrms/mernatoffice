import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

class RequestForDelete extends Component {
  state = {
    trackingAll: [],
    search: "",
    searchStatus: ""
  };

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

  handleCancel = e => {
    this.setState({
      trackingAll: [],
      search: "",
      searchStatus: ""
    });
  };

  render() {
    var trackingList = this.state.trackingAll.map(tracking => {
      return (
        <React.Fragment key={tracking.id}>
          <h5>
            You searched for <b>Request No. {tracking.reqno}</b>
          </h5>
          <table className="highlight">
            <thead>
              <tr>
                <th>Vendor No.</th>
                <th>Order No.</th>
                <th>Invoice No.</th>
                <th>Invoice Date</th>
                <th>Invoice Amount</th>
                <th>Tracking No.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
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
                <td>{tracking.tracking}</td>
              </tr>
            </tbody>
          </table>
          <div className="row">
            <form className="col s12">
              <div className="input-field col s9">
                <label htmlFor="search">
                  Enter the reason for deletion and click Submit
                </label>
                <input
                  onChange={this.handleChange}
                  name="search"
                  id="search"
                  type="text"
                  className="validate"
                />
              </div>
              <div className="input-field col s3">
                <div className="col s6">
                  <input type="button" className="btn" value="Submit" />
                </div>
                <div className="col s6">
                  <input
                    onClick={this.handleCancel}
                    type="button"
                    className="btn"
                    value="Cancel"
                  />
                </div>
              </div>
            </form>
          </div>
        </React.Fragment>
      );
    });

    return (
      <div className="container">
        {this.state.trackingAll.length === 0 ? (
          <React.Fragment>
            <SearchBar
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
            />
          </React.Fragment>
        ) : this.state.searchStatus ? (
          <React.Fragment>{trackingList}</React.Fragment>
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

export default RequestForDelete;
