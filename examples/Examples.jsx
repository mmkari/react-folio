import * as React from 'react';
import styled from 'styled-components';
import Paged from '../src/Paged';
import Lorem from './Lorem';
import withDimensions, {
  BreakingBlock as BreakingBlock2,
} from '../src/DimensionContext';

const MeasuredLorem = withDimensions(Lorem);

const StyledBreakingBlock2 = styled(BreakingBlock2).attrs({ className: 'BB2' })`
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

const BreakingBlock = ({ children, className }) => {
  return (
    <div className={className}>
      <div className="BreakingBlockVoid" />
      {children}
    </div>
  );
};

const StyledBreakingBlock = styled(BreakingBlock).attrs({
  className: 'BreakingBlock',
})`
  // line-height: 50px;
  // position: relative;
  // display: block;
  color: yellow;
  width: 100%;
  background: rgba(100, 100, 100, 0.2);
  // shape-outside: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  // shape-outside: inset(20% 0 10% 0);
  background: #00ddee44;
  // height: 250px;
  height: ${({ pageHeight }) => pageHeight}mm;


  .BreakingBlockVoid {
    width: 90%;
    // height: 100%;
    // width: 50px;
    // height: 48mm;
  height: ${({ pageHeight }) => pageHeight}mm;
  // height: ${({ footerHeight }) => footerHeight}mm;
    background: black;
    opacity: 0.2;
    // shape-outside: inset(100px 0 50px 0);
    // shape-outside: inset(${({ pageHeight, footerHeight }) =>
      pageHeight - footerHeight}mm 0 0px 0);
     shape-outside: inset(${({ pageHeight, footerHeight }) =>
       pageHeight - footerHeight - 10}mm 0 20px 0);

    float: left;
    // top: ${({ pageHeight, footerHeight }) => pageHeight - footerHeight}mm;
  }
`;
const WhiteBox = styled.div.attrs({ className: 'BOX' })`
  width: 70px;
  height: 290px;
  background: white;
  float: left;
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
            <StyledBreakingBlock2 className="Can-Break">
              <Lorem />
              <WhiteBox />
            </StyledBreakingBlock2>
            <StyledBreakingBlock pageHeight={297} footerHeight={12}>
              <Lorem />
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
              <WhiteBox /> */}
            </StyledBreakingBlock>
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
            <Lorem />
            <Lorem />
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
