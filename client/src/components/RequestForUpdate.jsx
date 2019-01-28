import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

class RequestForUpdate extends Component {
  state = {
    trackingAll: [],
    search: "",
    searchStatus: "",
    editVendor: false,
    editOrder: false,
    editInvoice: false,
    editDate: false,
    editAmount: false
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

  handleClickOnEdit = e => {
    this.setState({
      [e.target.id]: true
    });
  };

  render() {
    var trackingList = this.state.trackingAll.map(tracking => {
      return (
        <React.Fragment key={tracking.id}>
          <h5>
            You searched for <b>Request No. {tracking.reqno}</b> with{" "}
            <b>tracking no. {tracking.tracking}</b>
          </h5>
          <h6>Update the required fields and submit</h6>
          <table className="highlight">
            <thead>
              <tr>
                <th>Description</th>
                <th>Existing Value</th>
                <th>New value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vendor No.</td>
                <td>{tracking.vendor}</td>
                <td>
                  <input type="text" name="vendor" id="vendor" />
                </td>
              </tr>
              <tr>
                <td>Order No.</td>
                <td>{tracking.orderno}</td>
                <td>
                  <input type="text" name="order" id="order" />
                </td>
              </tr>
              <tr>
                <td>Invoice No.</td>
                <td>{tracking.invoice}</td>
                <td>
                  <input type="text" name="invoice" id="invoice" />
                </td>
              </tr>
              <tr>
                <td>Invoice Date</td>
                <td>
                  {tracking.date.substr(8, 2) +
                    "/" +
                    tracking.date.substr(5, 2) +
                    "/" +
                    tracking.date.substr(0, 4)}
                </td>
                <td>
                  <input type="text" name="date" id="date" />
                </td>
              </tr>
              <tr>
                <td>Invoice Amount</td>
                <td>
                  {this.state.editAmount ? (
                    <input
                      type="text"
                      name="editedAmount"
                      id="editedAmount"
                      value={tracking.amount}
                    />
                  ) : (
                    tracking.amount
                  )}
                </td>
                <td>
                  {this.state.editAmount ? null : (
                    <input
                      onClick={this.handleClickOnEdit}
                      className="btn"
                      type="button"
                      id="editAmount"
                      value="Edit"
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="row">
            <div className="input-field col s12">
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

export default RequestForUpdate;
