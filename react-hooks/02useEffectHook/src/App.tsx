import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce';
import './App.css'

function App() {

  //  useEffect without dependency
  // const [age, setAge] = useState(0);
  // const [count, setCount] = useState(0);
  // const handleClick = () => setAge(age + 1)
  // useEffect(() => {
  //   // setCount(prev => prev + 1);
  //   document.title = 'You are ' + age + ' years old!'
  // })

  //  useEffect with empty array dependency
  const [username, setUsername] = useState("");
  const [nameChangeCount, setNameChangeCount] = useState(0);
  useEffect(() => {
    setNameChangeCount(nameChangeCount + 1);
    setTimeout(() => {
      setUsername("John");
    }, 1500)
  }, []);

  //  useEffect btn click event array dependency
  const [btnclickcount, setbtnclickcount] = useState(0);
  const [btnClickCounter, setBtnClickCounter] = useState(0);
  const handleButtonClick = () => {
    setBtnClickCounter(btnClickCounter + 1);
  }
  useEffect(() => {
    setbtnclickcount(btnclickcount + 1);
  }, [btnClickCounter]);



  // Clean up 
  // useEffect(() => {
  //   console.log("A. Called right after every render");

  //   return () => console.log("B. Cleanup function called after every render");
  // });


  const [filter, setFilter] = useState("");
  const [debouncedFilter] = useDebounce(filter, 500);
  const [userCollection, setUserCollection] = useState([]);
  useEffect(() => {
    fetch(`https://swapi.dev/api/people?search=${filter}`)
      .then((response) => response.json())
      .then((json) => setUserCollection(json.results));
  }, [debouncedFilter]);

  return (
    <>
      <h3>React useEffect Hook without dependencies</h3>
      <pre><code>
        {` 
        Syntax
        useEffect(() => {
          // Side effect logic goes here
          return () => {
            // Cleanup logic (optional)
            };
            }, [dependencies]);
            
            Effect function: This is where your side effect code runs.
            Cleanup function: This optional return function cleans up side effects like subscriptions or timers when the component unmounts.
            Dependencies array: React re-runs the effect if any of the values in this array change.
        `}
      </code></pre>

      {/* <p> Look at the title of the current tab in your browser </p> */}
      {/* <button onClick={handleClick}>Update Title!! </button><br /> */}

      <pre><code>{`
      Without dependency array useEffect hook keeps on running
      `}</code></pre>
      {/* <div>{count}</div> */}
      <br />

      <h3>React useEffect Hook with empty array</h3>
      <pre><code>
        {` 
        Syntax For componentDidMount
          useEffect(()=>{
              //You can add your code here for mounting phase of component
              console.log("Mounting in Functional Component")
          },[])
          
        adding an empty array ensures that the useEffect is only triggered once 
        (when the component mounts)
        `}
      </code></pre>

      <h4>User name: {username}</h4>
      <pre><code>{`
      Empty dependency array useEffect hook triggered only once
      `}</code></pre>
      <div>{nameChangeCount}</div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />

      <pre><code>
        {` 
        Syntax For componentDidUpdate
        useEffect(()=>{
          //You can add your code for updating phase of component
          console.log("Updating in Functional Component")
          },[values])
          
          values triggers re render whenever they are updated in your program,
          you can add multiple values by separating them by commas
          `}
      </code></pre>


      <h3>React useEffect Hook with button click dependency</h3>
      <pre><code>{`
      By default the hook will run once on component load then it run on every click
      `}</code></pre>
      <p>Btn Clicked Count from useEffect: {btnclickcount} </p>
      <button onClick={handleButtonClick}>Click Me {btnClickCounter}</button>
      <br />
      <br />

      <h3>React useEffect Hook with API call based on Searched name</h3>
      <div>
        <input placeholder='Enter names to filter' value={filter} onChange={(e) => setFilter(e.target.value)} />
        <ul>
          {userCollection.map((user:any, index) => (
            <li key={index}>{user.name}</li>
          ))}
        </ul>
      </div>
      <pre><code>
        {` 
        Syntax For componentDidUpdate
          useEffect(()=>{
              return()=>{
              //You can add your code for unmounting phase of component
              console.log("Functional Component Removed ")
              }
          },[])

        Write all the code of unmounting phase only inside the callback function
        `}
      </code></pre>
    </>
  )
}

export default App

