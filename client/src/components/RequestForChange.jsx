import React, { Component } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class RequestForChange extends Component {
  state = {
    trackingAll: [],
    search: "",
    searchStatus: false,
    searchError: "",
    editVendor: { status: false, data: "" },
    editOrder: { status: false, data: "" },
    editInvoice: { status: false, data: "" },
    editDate: { status: false, data: "" },
    editAmount: { status: false, data: "" },
    vendorError: "",
    orderError: "",
    invoiceError: "",
    amountError: "",
    dateError: "",
    submitError: ""
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
    if (this.state.search.length === 12) {
      axios.post("getposts", { data }).then(res => {
        if (res.data.results.length !== 0) {
          var {
            editVendor,
            editOrder,
            editInvoice,
            editDate,
            editAmount
          } = this.state;

          let date = res.data.results[0].date.split("-");
          date = new Date(date[0], date[1] - 1, date[2].substr(0, 2));

          editVendor.data = res.data.results[0].vendor;
          editOrder.data = res.data.results[0].orderno;
          editInvoice.data = res.data.results[0].invoice;
          editDate.data = date;
          editAmount.data = res.data.results[0].amount;
          this.setState({
            trackingAll: res.data.results,
            searchStatus: true,
            editVendor: editVendor,
            editOrder: editOrder,
            editInvoice: editInvoice,
            editDate: editDate,
            editAmount: editAmount,
            searchError: ""
          });
        } else if (res.data.msgStatus) {
          this.setState({
            searchError: res.data.msg
          });
        } else {
          this.setState({
            searchError: "Please enter correct request number."
          });
        }
      });
    } else {
      this.setState({
        searchError: "Please enter correct request number."
      });
    }
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
      [e.target.id]: temp,
      submitError: ""
    });
  };

  handleChangeOnEdit = e => {
    var temp = this.state[e.target.name];
    temp.data = e.target.value;
    this.setState({
      [e.target.name]: temp,
      submitError: ""
    });
  };
  handleChangeDateOnEdit = date => {
    var temp = this.state.editDate;
    temp.data = date;
    this.setState({
      editDate: temp,
      submitError: ""
    });
  };
  handleChangeSubmit = e => {
    var data = {
      reqno: this.state.trackingAll[0].reqno,
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
      axios
        .post("/requestforchange", { data })
        .then(res => {
          if (res.data.data) {
            this.props.history.push("/reqchangesuccess");
          } else if (res.data.msgStatus) {
            this.setState({
              submitError: res.data.msg
            });
          }
        })
        .catch(err => {
          throw err;
        });
    } else {
      console.log("error in the request input data");
    }
  };

  render() {
    var trackingList = this.state.trackingAll.map(tracking => {
      return (
        <React.Fragment>
          {tracking.tracking === "absent" ? (
            <div key={tracking.id}>
              <h6>
                You searched for <b>Request No. {tracking.reqno}. </b>
                <br />
                The Tracking number is not generated
                <br />
                Update the required fields by clicking edit. Submit once
                completed
              </h6>
              <table className="highlight">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Vendor No.</td>
                    <td>
                        <div className="input-field">
                          <input
                            onChange={this.handleChangeOnEdit}
                            type="text"
                            name="editVendor"
                            defaultValue={tracking.vendor}
                          />
                          <span className="helper-text red-text">
                            {this.state.vendorError}
                          </span>
                        </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Order No.</td>
                    <td>
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
                    </td>
                  </tr>
                  <tr>
                    <td>Invoice No.</td>
                    <td>
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
                    </td>
                  </tr>
                  <tr>
                    <td>Invoice Date</td>
                    <td>
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
                    </td>
                  </tr>
                  <tr>
                    <td>Invoice Amount</td>
                    <td>
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
              <span className="helper-text red-text">
                {this.state.submitError}
              </span>
            </div>
          ) : (
            <div key={tracking.id}>
              <h6>
                You searched for <b>Request No. {tracking.reqno}</b> <br />
                Tracking number is generated which is: <b>{tracking.tracking}</b>
                <br />
                Update the required fields by clicking edit. Submit once
                completed
              </h6>
              <table className="highlight">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Vendor No.</td>
                    <td>
                      {
                        tracking.vendor
                      }
                    </td>
                    <td>

                    </td>
                  </tr>
                  <tr>
                    <td>Order No.</td>
                    <td>
                      {
                        tracking.orderno
                      }
                    </td>
                    <td>

                    </td>
                  </tr>
                  <tr>
                    <td>Invoice No.</td>
                    <td>
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
                    </td>
                  </tr>
                  <tr>
                    <td>Invoice Date</td>
                    <td>
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
                    </td>
                  </tr>
                  <tr>
                    <td>Invoice Amount</td>
                    <td>
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
              <span className="helper-text red-text">
                {this.state.submitError}
              </span>
            </div>
          )}
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
              searchError={this.state.searchError}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>{trackingList}</React.Fragment>
        )}
      </div>
    );
  }
}

export default RequestForChange;
