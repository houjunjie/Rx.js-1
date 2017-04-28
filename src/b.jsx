import React, { Component } from 'react';

class B extends Component {
  constructor(props) {
    super(props);
    this.state = {
      self: 'B'
    }
  }
  render() {
    const { self } = this.state;
    return (
      <div>
        {self}
      </div>
    );
  }
}


export default B;