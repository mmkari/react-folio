import * as React from 'react';
import styled from 'styled-components';
import Paged from '../src/Paged';
import Lorem, { getLorem } from './Lorem';
import withDimensions, { BreakingBlock } from '../src/DimensionContext';
import Text from '../src/Text';

const MeasuredLorem = withDimensions(Lorem, 'CANNOT_BREAK');

const StyledBreakingBlock = styled(BreakingBlock).attrs({ className: 'BB2' })`
  // background: purple;
`;

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

const WhiteBox = styled.div.attrs({ className: 'BOX' })`
  width: 100%;
  height: 320px;
  background-image: linear-gradient(
    0deg,
    #ee617d 25%,
    #3d6f8e 25%,
    #3d6f8e 50%,
    #ee617d 50%,
    #ee617d 75%,
    orange 75%,
    orange 100%
  );
  background-size: 100% 320px;
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
            <Text>{getLorem()}</Text>
            <StyledBreakingBlock className="Can-Break">
              <WhiteBox />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <WhiteBox />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <WhiteBox />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <WhiteBox />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
            <Text>{getLorem()}</Text>

            <StyledBreakingBlock className="Can-Break">
              <Lorem />
            </StyledBreakingBlock>
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
  padding: 0;
`;

export default StyledExamples;
