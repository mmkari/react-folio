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
    <div
      className={classnames('DimensionContextConsumer', className)}
      ref={getRef}
    >
      {children}
    </div>
  );
};

const withDimensions = (Component, className) => (props) => {
  return (
    <DimensionContextConsumer className={className}>
      <Component {...props} />
    </DimensionContextConsumer>
  );
};

// working on breaking block
const BreakingBlock = ({ children, className }) => {
  const [breaking, setBreaking] = React.useState(false);
  const [height, setHeight] = React.useState(null);

  const updateLayout = (values) => {
    console.log('Received updated layout', values);
    setHeight(values.h);
    // set
  };

  return (
    <div className={className}>
      {/* render the children */}
      {!breaking && <div>{children}</div>}
      <>
        {/* render new layout if breaking */}
        {breaking && (
          <div>
            <div className="BreakingBlock-start">{children}</div>
            <div
              className="BreakingBlock-end"
              style={{ textTransform: 'uppercase' }}
            >
              {children}
            </div>
          </div>
        )}
      </>
    </div>
  );
};
const StyledBreakingBlock = styled(BreakingBlock)`
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
`;

export default withDimensions;
export {
  DimensionContextProvider,
  DimensionContextConsumer,
  StyledBreakingBlock as BreakingBlock,
};
