import * as React from 'react';
import styled from 'styled-components';
import withDimensions from './DimensionContext';

const TextRow = ({ row }) => (
  <div className="TextBlock-row">{row && row.trim()}</div>
);
const MeasuredTextRow = withDimensions(styled(TextRow)`
  background: #0e22df;
`);

const Text = ({ className, children, charMax = 103 }) => {
  let rows = null;
  if (typeof children === 'string') {
    const regex = new RegExp(`.{1,${charMax}} `, 'g'); // match lines of upto 60 chars
    rows = children.match(regex);
  }

  return (
    <div className="TextBlock">
      {rows && rows.map((row) => <MeasuredTextRow row={row} />)}
    </div>
  );
};

export default Text;
