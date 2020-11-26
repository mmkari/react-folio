import * as React from 'react';

const useContainerMeasurements = (measureOnce) => {
  const ref = React.useRef();
  const [dimension, setDimension] = React.useState();

  React.useLayoutEffect(() => {
    if (!dimension || !measureOnce) {
      // measure only if not yet measured or not limited to one measurement
      if (ref.current && ref.current.getBoundingClientRect) {
        const {
          top,
          right,
          bottom,
          left,
          width,
          height,
          x,
          y,
        } = ref.current.getBoundingClientRect();
        // const rect = ref.current.getBoundingClientRect()
        setDimension({ top, right, bottom, left, width, height, x, y });
      }
    }
  }, [ref.current]);

  return [ref, dimension];
};

export default useContainerMeasurements;
