import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class RequestForChange extends Component {
  state = {
    trackingAll: [],
    search: "",
    searchStatus: false,
    editVendor: { status: false, data: "" },
    editOrder: { status: false, data: "" },
    editInvoice: { status: false, data: "" },
    editDate: { status: false, data: "" },
    editAmount: { status: false, data: "" },
    vendorError: "",
    orderError: "",
    invoiceError: "",
    amountError: "",
    dateError: ""
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
      var {
        editVendor,
        editOrder,
        editInvoice,
        editDate,
        editAmount
      } = this.state;

      let date = response.data.results[0].date.split("-");
      date = new Date(date[0], date[1] - 1, date[2].substr(0, 2));

      editVendor.data = response.data.results[0].vendor;
      editOrder.data = response.data.results[0].orderno;
      editInvoice.data = response.data.results[0].invoice;
      editDate.data = date;
      editAmount.data = response.data.results[0].amount;
      this.setState({
        trackingAll: response.data.results,
        searchStatus: true,
        editVendor: editVendor,
        editOrder: editOrder,
        editInvoice: editInvoice,
        editDate: editDate,
        editAmount: editAmount
      });
    });
  };

  handleCancel = e => {
    this.setState({
      trackingAll: [],
      search: "",
      searchStatus: false,
      editVendor: { status: false, data: "" },
      editOrder: { status: false, data: "" },
      editInvoice: { status: false, data: "" },
      editDate: { status: false, data: "" },
      editAmount: { status: false, data: "" }
    });
  };

  handleClickOnEdit = e => {
    var temp = this.state[e.target.id];
    temp.status = true;
    this.setState({
      [e.target.id]: temp
    });
  };

  handleChangeOnEdit = e => {
    var temp = this.state[e.target.name];
    temp.data = e.target.value;
    this.setState({
      [e.target.name]: temp
    });
  };
  handleChangeDateOnEdit = date => {
    var temp = this.state.editDate;
    temp.data = date;
    this.setState({
      editDate: temp
    });
  };
  handleChangeSubmit = e => {
    var data = {
      vendor: this.state.editVendor.data,
      order: this.state.editOrder.data,
      invoice: this.state.editInvoice.data,
      date: this.state.editDate.data,
      amount: this.state.editAmount.data,
      token: localStorage.getItem("token")
    };

    if (data.vendor.replace(/\s+/, "").length < 1) {
      this.setState({
        vendorError: "Enter the vendor code."
      });
    } else {
      this.setState({
        vendorError: ""
      });
    }

    if (data.order.replace(/\s+/, "").length < 1) {
      this.setState({
        orderError: "Enter the Purchase Order No."
      });
    } else {
      this.setState({
        orderError: ""
      });
    }

    if (data.invoice.replace(/\s+/, "").length < 1) {
      this.setState({
        invoiceError: "Enter the invoice number or bill number"
      });
    } else {
      this.setState({
        invoiceError: ""
      });
    }

    if (data.date === null) {
      this.setState({
        startDateError: "Select the invoice date"
      });
    } else {
      this.setState({
        startDateError: ""
      });
    }

    if (data.amount.replace(/\s+/, "").length < 1) {
      this.setState({
        amountError: "Enter the total value of the invoice"
      });
    } else {
      this.setState({
        amountError: ""
      });
    }

    if (
      data.vendor.replace(/\s+/, "").length > 0 &&
      data.order.replace(/\s+/, "").length > 0 &&
      data.invoice.replace(/\s+/, "").length > 0 &&
      typeof data.date === "object" &&
      data.amount.replace(/\s+/, "").length > 0
    ) {
      // axios
      //   .post("http://localhost:3000/addpost", { data })
      //   .then(res => {
      //     if (res.data) {
      //       this.props.history.push("/reqsuccess");
      //     } else {
      //       this.props.history.push("/");
      //     }
      //   })
      //   .catch(err => {
      //     throw err;
      //   });
    } else {
      console.log("error in the request input data");
    }
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
                  {this.state.editVendor.status ? (
                    <div className="input-field">
                      <input
                        type="text"
                        name="editedVendor"
                        id="editedVendor"
                        defaultValue={tracking.vendor}
                      />
                      <span className="helper-text red-text">
                        {this.state.vendorError}
                      </span>
                    </div>
                  ) : (
                    tracking.vendor
                  )}
                </td>
                <td>
                  {this.state.editVendor.status ? (
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
                  {this.state.editOrder.status ? (
                    <div className="input-field">
                      <input
                        onChange={this.handleChangeOnEdit}
                        type="text"
                        name="editOrder"
                        defaultValue={tracking.orderno}
                      />
                      <span className="helper-text red-text">
                        {this.state.orderError}
                      </span>
                    </div>
                  ) : (
                    tracking.orderno
                  )}
                </td>
                <td>
                  {this.state.editOrder.status ? (
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
                  {this.state.editInvoice.status ? (
                    <div className="input-field">
                      <input
                        onChange={this.handleChangeOnEdit}
                        type="text"
                        name="editInvoice"
                        defaultValue={tracking.invoice}
                      />
                      <span className="helper-text red-text">
                        {this.state.invoiceError}
                      </span>
                    </div>
                  ) : (
                    tracking.invoice
                  )}
                </td>
                <td>
                  {this.state.editInvoice.status ? (
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
                  {this.state.editDate.status ? (
                    <div className="input-field">
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        name="editDate"
                        selected={this.state.editDate.data}
                        onChange={this.handleChangeDateOnEdit}
                        placeholderText="Click to select the date"
                        showMonthDropdown
                        showYearDropdown
                        maxDate={new Date()}
                      />
                      <span className="helper-text red-text">
                        {this.state.dateError}
                      </span>
                    </div>
                  ) : (
                    tracking.date.substr(8, 2) +
                    "/" +
                    tracking.date.substr(5, 2) +
                    "/" +
                    tracking.date.substr(0, 4)
                  )}
                </td>
                <td>
                  {this.state.editDate.status ? (
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
                  {this.state.editAmount.status ? (
                    <div className="input-field">
                      <input
                        onChange={this.handleChangeOnEdit}
                        type="text"
                        name="editAmount"
                        defaultValue={tracking.amount}
                      />
                      <span className="helper-text red-text">
                        {this.state.amountError}
                      </span>
                    </div>
                  ) : (
                    tracking.amount
                  )}
                </td>
                <td>
                  {this.state.editAmount.status ? (
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
                <input
                  onClick={this.handleChangeSubmit}
                  type="button"
                  className="btn green"
                  value="Submit"
                />
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
          <u>Request: Change</u>
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

export default RequestForChange;
