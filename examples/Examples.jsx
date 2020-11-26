import * as React from 'react';
import styled from 'styled-components';
import Paged from '../src/Paged';
import Lorem from './Lorem';
import withDimensions from '../src/DimensionContext';

const MeasuredLorem = withDimensions(Lorem);

const Container = styled.div.attrs({ className: 'Container' })`
  padding: 10mm;
`;

class Examples extends React.Component {
  state = {};

  render() {
    const {} = this.state;
    const { className } = this.props;

    return (
      <div className="Examples">
        <Paged className={className}>
          <Container>
            {/* <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem /> */}
            <MeasuredLorem />
            <MeasuredLorem />
            <MeasuredLorem />
            <MeasuredLorem />
            <MeasuredLorem />
            <MeasuredLorem />
            <MeasuredLorem />
            <MeasuredLorem />
          </Container>
        </Paged>
      </div>
    );
  }
}

const StyledExamples = styled(Examples)`
  background: red;
`;

export default StyledExamples;
