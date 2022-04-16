import React from 'react';

const TestComponent = () => {
  const [count, setCount] = React.useState(0);
  const [flag, setFlag] = React.useState(false)

  return (
      <>
    <h3>{count} {flag}</h3>
    <span>
      <button id="count-up" data-testid="count-up" type="button" onClick={() => setCount(count + 1)}>Count Up</button>
      <button id="count-down" data-testid="count-down" type="button" onClick={() => setCount(count - 1)}>Count Down</button>
      <button id="zero-count" data-testid="zero-count" type="button" onClick={() => {setCount(0); setFlag(!flag)}}>Zero</button>
    </span>
    </>
  );
}

export default TestComponent;