import * as React from 'react';
import Paged from '../src/Paged';

class Examples extends React.Component {
  state = {};

  render() {
    const {} = this.state;

    return (
      <div className="Examples">
        <Paged>LONG DOCUMENT HERE</Paged>
      </div>
    );
  }
}

export default Examples;
