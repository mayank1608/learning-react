import { useState } from 'react'

function App() {
  // Counter
  const [count, setCount] = useState(0);
  // Increment by 1
  function handleIncrement() {
    // setCount(prevCount => prevCount + 1);
    setCount(count + 1);
  }

  // Decrement by 1
  function handleDecrement() {
    setCount(prevCount => prevCount - 1);
  }


  return (
    <>
      <div className="container">
        <h3>Counter App</h3>
        <h5>{count}</h5>
        <button className='btn btn-success m-2' disabled={count >= 20} onClick={handleIncrement}>
          Increment
        </button>
        <button className='btn btn-danger m-2' disabled={count <= 0} onClick={handleDecrement}>
          Decrement
        </button>
        <button className='btn btn-info m-2' onClick={() => setCount(0)}>Reset</button>
      </div>
    </>
  )
}

export default App
