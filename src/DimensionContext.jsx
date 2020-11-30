import * as React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

const DimensionContext = React.createContext('INITIAL');

const DimensionContextProvider = ({ children, getDims }) => {
  const refs = React.useRef([]);

  const getRef = (ref) => {
    refs.current = [...refs.current, ref];
  };

  React.useEffect(() => {
    if (refs.current) {
      getDims(refs.current);
    }
  }, []);

  return (
    <DimensionContext.Provider value={{ getRef }}>
      {children}
    </DimensionContext.Provider>
  );
};

const DimensionContextConsumer = ({ children, className }) => {
  const { getRef } = React.useContext(DimensionContext);
  return (
    <ChildComponent
      className={classnames('DimensionContextConsumer', className)}
      ref={getRef}
    >
      {children}
    </ChildComponent>
  );
};

class ChildComponent extends React.Component {
  childRef = React.createRef();

  elementRef = React.createRef();

  render() {
    const { children, className } = this.props;
    return (
      <div
        ref={this.elementRef}
        className={classnames('ChildComponent', className)}
      >
        {React.cloneElement(children, { ref: this.childRef })}
      </div>
    );
  }
}

const withDimensions = (Component, className) => (props) => {
  return (
    <DimensionContextConsumer className={className}>
      <Component {...props} />
    </DimensionContextConsumer>
  );
};

// working on breaking block
class BreakingBlock extends React.Component {
  state = {
    breaking: false,
    height: null,
    heightFirstPart: null,
    paddingTopSecondPart: null,
    heightSecondPart: null,
  };

  updateLayout = (values) => {
    const {
      heightFirstPart,
      paddingTopSecondPart,
      heightSecondPart,
      originalHeight,
    } = values;
    this.setState({
      breaking: true,
      height: originalHeight,
      heightFirstPart,
      paddingTopSecondPart,
      heightSecondPart,
    });
  };

  render() {
    const { children, className } = this.props;
    const {
      breaking,
      height,
      heightFirstPart,
      paddingTopSecondPart,
      heightSecondPart,
    } = this.state;

    return (
      <div className={className}>
        {/* render the children */}
        {!breaking && <div>{children}</div>}
        <>
          {/* render new layout if breaking */}
          {breaking && (
            <div style={{ height }}>
              <BreakingBlockStart heightFirstPart={heightFirstPart}>
                {children}
              </BreakingBlockStart>
              <BreakingBlockDivider
                paddingTopSecondPart={paddingTopSecondPart}
              />
              <BreakingBlockEnd
                heightSecondPart={heightSecondPart}
                paddingTopSecondPart={paddingTopSecondPart}
              >
                {children}
              </BreakingBlockEnd>
            </div>
          )}
        </>
      </div>
    );
  }
}

const BreakingBlockStart = styled.div.attrs({
  className: 'BreakingBlock-start',
})`
  height: ${({ heightFirstPart }) => heightFirstPart}px;
`;

const BreakingBlockDivider = styled.div`
  height: ${({ paddingTopSecondPart }) => paddingTopSecondPart}px;
  width: 100%;
  background: gray;
`;

const BreakingBlockEnd = styled.div.attrs({
  className: 'BreakingBlock-end',
})`
textTransform: 'uppercase'
  height: ${({ heightSecondPart }) => heightSecondPart}px;
  // padding-top: ${({ paddingTopSecondPart }) => paddingTopSecondPart}px;
`;

const StyledBreakingBlock = withDimensions(
  styled(BreakingBlock)`
    .BreakingBlock-start {
      background: yellow;
      height: 30%;
      overflow: hidden;
      position: relative;
    }
    .BreakingBlock-end {
      background: green;
      height: 70%;
      overflow: hidden;
      position: relative;
    }
  `,
  'Can-Break'
);

export default withDimensions;
export {
  DimensionContextProvider,
  DimensionContextConsumer,
  StyledBreakingBlock as BreakingBlock,
};
