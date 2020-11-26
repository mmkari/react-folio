import * as React from 'react';
import classnames from 'classnames';

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

export default withDimensions;
export { DimensionContextProvider, DimensionContextConsumer };
