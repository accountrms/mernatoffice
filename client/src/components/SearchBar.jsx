import React from "react";

const SearchBar = props => {
  return (
    <div className="row">
      <form className="col s12" onSubmit={props.onSubmit}>
        <div className="col s9">
          <label htmlFor="search">
            Enter your request number to start with
          </label>
          <input
            onChange={props.onChange}
            name="search"
            id="search"
            type="text"
            value={props.search}
          />
        </div>
        <div className="input-field col s3">
          <input
            type="submit"
            className="btn yellow black-text"
            value="Search"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
