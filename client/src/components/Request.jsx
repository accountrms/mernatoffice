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
    startDate: ""
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
            <span class="helper-text">
              Enter the vendor code here. This will be available in the Purchase
              Order
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
            <span class="helper-text">
              Enter the Purchase Order No. starting with 4 or 5. Otherwise enter
              the FA No.
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
            <span class="helper-text">
              Enter the invoice number or bill number of the invoice / bill
              submitted by the vendor
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
            <span class="helper-text">Enter the invoice date</span>
          </div>
          <div className="input-field">
            <label htmlFor="amount">Invoice Amount</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="amount"
              id="amount"
            />
            <span class="helper-text">Enter the total value of invoice</span>
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
