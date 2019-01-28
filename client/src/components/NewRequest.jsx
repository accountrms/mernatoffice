import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "materialize-css/dist/css/materialize.css";
import "materialize-css/dist/js/materialize";
import "react-datepicker/dist/react-datepicker.css";

class Request extends Component {
  state = {
    vendor: "",
    order: "",
    invoice: "",
    amount: "",
    startDate: null,
    vendorError: "",
    orderError: "",
    invoiceError: "",
    amountError: "",
    startDateError: ""
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleDateChange = date => {
    this.setState({
      startDate: date
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    var data = {
      vendor: this.state.vendor,
      order: this.state.order,
      invoice: this.state.invoice,
      date: this.state.startDate,
      amount: this.state.amount,
      token: localStorage.getItem("token")
    };

    if (data.vendor.replace(/\s+/, "").length < 1) {
      this.setState({
        vendorError:
          "Enter the vendor code here. This will be available in the Purchase Order"
      });
    } else {
      this.setState({
        vendorError: ""
      });
    }

    if (data.order.replace(/\s+/, "").length < 1) {
      this.setState({
        orderError:
          "Enter the Purchase Order No. starting with 4 or 5. Otherwise enter the FA No."
      });
    } else {
      this.setState({
        orderError: ""
      });
    }

    if (data.invoice.replace(/\s+/, "").length < 1) {
      this.setState({
        invoiceError:
          "Enter the invoice number or bill number of the invoice / bill submitted by the vendor"
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
        .post("http://localhost:3000/addpost", { data })
        .then(res => {
          if (res.data) {
            this.props.history.push("/reqsuccess");
          } else {
            this.props.history.push("/");
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
    return (
      <div className="container">
        <h4>Enter the details below and click submit</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="input-field">
            <label htmlFor="vendor">Vendor Code</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="vendor"
              id="vendor"
            />
            <span className="helper-text red-text">
              {this.state.vendorError}
            </span>
          </div>

          <div className="input-field">
            <label htmlFor="order">Order No</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="order"
              id="order"
            />
            <span className="helper-text red-text">
              {this.state.orderError}
            </span>
          </div>

          <div className="input-field">
            <label htmlFor="invoice">Invoice Number</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="invoice"
              id="invoice"
            />
            <span className="helper-text red-text">
              {this.state.invoiceError}
            </span>
          </div>

          <div className="input-field">
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={this.state.startDate}
              onChange={this.handleDateChange}
              placeholderText="Click to select the date"
              showMonthDropdown
              showYearDropdown
              maxDate={new Date()}
            />
            <span className="helper-text red-text">
              {this.state.startDateError}
            </span>
          </div>

          <div className="input-field">
            <label htmlFor="amount">Invoice Amount</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="amount"
              id="amount"
            />
            <span className="helper-text red-text">
              {this.state.amountError}
            </span>
          </div>

          <button className="btn btn-large" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Request;
