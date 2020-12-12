import React, {Component} from 'react';

class Loader extends Component {
  render() {
    return (
      <div className="loader">
        <div className="first-cell"></div>
        <div className="second-cell"></div>
        <div className="loader-circle"></div>
      </div>
    );
  }
}

export default Loader;
