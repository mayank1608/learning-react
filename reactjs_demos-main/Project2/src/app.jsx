import { useState,  useEffect } from 'react'
import './app.css'
import MyComponent1 from './components/mycomponent1'
import MyComponent2 from './components/mycomponent2'

export function App() {
  const [count, setCount] = useState(0)
  const [ name, setName]= useState("L&T")
   
  function updateCount(){
    setCount(count+1)
  }

  function updateName(){
    setName("LTTS")
  }

  useEffect( ()=> {
   console.log("Component Mounted")

  },[count])

  return (
    <>
      {/* <h1>Demo on useEffect Hook</h1>
      <h1>Button Clicked {count} times and Name is {name}</h1>
      <button onClick={updateCount}>Click To Increase Count</button>
      <button onClick={updateName}>Click to Change Name</button> */}

      <hr color="red"></hr> 
       <MyComponent1/>
      <hr color="red"></hr> 
       <MyComponent2/>
    </>
  )
}
