import * as React from 'react';
import styled from 'styled-components';
import Paged from '../src/Paged';
import Lorem from './Lorem';
import withDimensions from '../src/DimensionContext';

const MeasuredLorem = withDimensions(Lorem);

const Container = styled.div.attrs({ className: 'Container' })`
  padding: 10mm;
`;

const PrintButton = styled.button.attrs({ className: 'PrintButton' })`
  position: absolute;
  top: 10%;
  width: 100%;
  height: 80px;
  z-index: 1000;
  border: none;
  background: rgba(100, 100, 200, 0.7);
  transition: font-size 0.4s, background 0.4s;

  &:hover {
    background: #ddffee;
    font-size: 20px;
    cursor: pointer;
  }

  @media print {
    display: none;
  }
`;

class Examples extends React.Component {
  state = {};

  render() {
    const {} = this.state;
    const { className } = this.props;

    return (
      <div className="Examples">
        <Paged className={className}>
          <PrintButton
            onClick={() => {
              window.print();
            }}
          >
            PRINT ME!
          </PrintButton>
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
