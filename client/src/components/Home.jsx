import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Home extends Component {
  state = {
    trackingAll: [],
    search: ""
  };

  componentDidMount() {
    var data = {
      token: localStorage.getItem("token"),
      id: this.props.id,
      searchStatus: false
    };
    axios.post("/getposts", { data }).then(response => {
      this.setState({
        trackingAll: response.data.results
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
      id: this.props.id,
      search: this.state.search,
      searchStatus: true
    };
    axios.post("getposts", { data }).then(response => {
      this.setState({
        trackingAll: response.data.results
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
              this.props.id === "admin" ? (
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
            <div className="row">
              <form className="col s12">
                <div className="input-field col s9">
                  <label htmlFor="search">
                    Enter your request number to search and check status
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
                  <input
                    onClick={this.handleSubmit}
                    type="submit"
                    className="btn"
                    value="Search"
                  />
                </div>
              </form>
            </div>

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
