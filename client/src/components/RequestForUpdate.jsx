import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

class RequestForUpdate extends Component {
  state = {
    trackingAll: [],
    search: "",
    searchStatus: false,
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
      searchStatus: "",
      editVendor: false,
      editOrder: false,
      editInvoice: false,
      editDate: false,
      editAmount: false
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
          <h6>
            You searched for <b>Request No. {tracking.reqno}</b> with{" "}
            <b>Tracking no. {tracking.tracking}</b>
          </h6>
          <h6>
            Update the required fields by clicking edit. Submit once completed
          </h6>
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
                <td>
                  {this.state.editVendor ? (
                    <input
                      type="text"
                      name="editedVendor"
                      id="editedVendor"
                      defaultValue={tracking.vendor}
                    />
                  ) : (
                    tracking.vendor
                  )}
                </td>
                <td>
                  {this.state.editVendor ? (
                    <input
                      className="btn"
                      type="button"
                      disabled="disabled"
                      value="Editing"
                    />
                  ) : (
                    <input
                      onClick={this.handleClickOnEdit}
                      className="btn"
                      type="button"
                      id="editVendor"
                      value="Edit"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Order No.</td>
                <td>
                  {this.state.editOrder ? (
                    <input
                      type="text"
                      name="editedOrder"
                      id="editedOrder"
                      defaultValue={tracking.orderno}
                    />
                  ) : (
                    tracking.orderno
                  )}
                </td>
                <td>
                  {this.state.editOrder ? (
                    <input
                      className="btn"
                      type="button"
                      disabled="disabled"
                      value="Editing"
                    />
                  ) : (
                    <input
                      onClick={this.handleClickOnEdit}
                      className="btn"
                      type="button"
                      id="editOrder"
                      value="Edit"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Invoice No.</td>
                <td>
                  {this.state.editInvoice ? (
                    <input
                      type="text"
                      name="editedInvoice"
                      id="editedInvoice"
                      defaultValue={tracking.invoice}
                    />
                  ) : (
                    tracking.invoice
                  )}
                </td>
                <td>
                  {this.state.editInvoice ? (
                    <input
                      className="btn"
                      type="button"
                      disabled="disabled"
                      value="Editing"
                    />
                  ) : (
                    <input
                      onClick={this.handleClickOnEdit}
                      className="btn"
                      type="button"
                      id="editInvoice"
                      value="Edit"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Invoice Date</td>
                <td>
                  {this.state.editDate ? (
                    <input
                      type="text"
                      name="editedDate"
                      id="editedDate"
                      defaultValue={
                        tracking.date.substr(8, 2) +
                        "/" +
                        tracking.date.substr(5, 2) +
                        "/" +
                        tracking.date.substr(0, 4)
                      }
                    />
                  ) : (
                    tracking.date.substr(8, 2) +
                    "/" +
                    tracking.date.substr(5, 2) +
                    "/" +
                    tracking.date.substr(0, 4)
                  )}
                </td>
                <td>
                  {this.state.editDate ? (
                    <input
                      className="btn"
                      type="button"
                      disabled="disabled"
                      value="Editing"
                    />
                  ) : (
                    <input
                      onClick={this.handleClickOnEdit}
                      className="btn"
                      type="button"
                      id="editDate"
                      value="Edit"
                    />
                  )}
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
                      defaultValue={tracking.amount}
                    />
                  ) : (
                    tracking.amount
                  )}
                </td>
                <td>
                  {this.state.editAmount ? (
                    <input
                      className="btn"
                      type="button"
                      disabled="disabled"
                      value="Editing"
                    />
                  ) : (
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
                <input type="button" className="btn green" value="Submit" />
              </div>
              <div className="col s6">
                <input
                  onClick={this.handleCancel}
                  type="button"
                  className="btn red"
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
        <h5>
          <u>Request: Update</u>
        </h5>
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
