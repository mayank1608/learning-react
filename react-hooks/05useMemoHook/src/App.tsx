import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');

  // Expensive calculation function
  const expensiveCalculation = (num: number) => {
    console.log('Calculating...');
    for (let i = 0; i < 1000000000; i++) { } // Simulate a heavy computation
    return num * 2;
  };

  // Memoize the result of the expensive calculation
  const memoizedValue = useMemo(() => expensiveCalculation(count), [count]);

  return (
    <>
      <div>
        <h1>useMemo Hook Example</h1>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
        />
        <p>Input Value: {inputValue}</p>
        <p>Count: {count}</p>
        <p>Memoized Value: {memoizedValue}</p>
        <button onClick={() => setCount(count + 1)}>Increment Count</button>
      </div>
    </>
  )
}

export default App
