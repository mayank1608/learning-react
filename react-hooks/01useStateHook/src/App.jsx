import { useState } from 'react'
import './App.css'

function App() {

  // Counter
  const [count, setCount] = useState(0);
  // Increment by 4
  function handleIncrement() {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  }

  // Decrement by 2
  function handleDecrement() {
    setCount(prevCount => prevCount - 2);
  }


  // User Form 
  const [userInfo, setUserInfo] = useState({
    name: "John",
    age: 21,
  });

  const [submitted, setSubmitted] = useState(false);

  // Update user name
  const updateUserName = (value) => {
    setUserInfo({
      ...userInfo,
      name: value
    })
  };

  // update user age
  const updateUserAge = (value) => {
    setUserInfo({
      ...userInfo,
      age: value
    })
  };

  // Form submitted check
  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <>
      <h3>React useState hook with increment/decrement counter</h3>
      <pre><code>
        {` 
        Syntax
        const [state, setState] = useState(initialState)
        state: It is the value of the current state.
        setState: It is the function that is used to update the state.
        initialState: It is the initial value of the state.
        `}
      </code></pre>
      <h5>{count}</h5>
      {(count > 20 || count <= 0) && <p><small style={{ color: 'red' }}>count should be between 0 to 20</small></p>}
      <button onClick={() => setCount(0)}>Reset</button>
      <button disabled={count > 20} onClick={handleIncrement}>
        Increment by 4
      </button>
      <button disabled={count <= 0} onClick={handleDecrement}>
        Decrement by 2
      </button>

      
      <pre><code>
        {`
        useState(0): Initializes count with 0.
        setCount(prevCount => prevCount + 1): x 4 Updates the state by adding 1 to the previous count value and repeated 4 times.
        setCount(count + 4): Increment can be done by using this also.
        setCount(count – 2): Decreases the state by 2.
        `}
      </code></pre>

      <br />
      <br />



      <h3>React useState hook with objects</h3>
      <h5>{userInfo.name} - {userInfo.age}</h5>
      <div>
        <input
          type="text"
          value={userInfo.name}
          onChange={(e) => updateUserName(e.target.value)}
          placeholder="Enter your name"
        /><br />
        <input
          type="number"
          value={userInfo.age}
          onChange={(e) => updateUserAge(e.target.value)}
          placeholder="Enter your age"
        /><br />
        <button onClick={handleSubmit}>Submit</button>
        {submitted && <p>Form Submitted!</p>}
      </div>

      <pre><code>
        {`
        useState{name: "John",age: 21,}: Initializes name and age with default values John and 21.
        onChange={(e): setUserInfo({...userInfo, name: e.target.value})}: Updates name in setUserInfo state as the user types.
        onChange={(e): setUserInfo({...userInfo, age: e.target.value})}}: Updates age in setUserInfo state as the user types.
        setSubmitted(true): Marks the form as submitted.
        `}
      </code></pre>

    </>
  );
}

export default App
