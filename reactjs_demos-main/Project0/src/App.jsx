import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Calculator from './component/Calculator';
import Calculator_Dy from './component/Calculator-Dynamic';
import UpperCaseConverter from './component/UpperCaseConverter';


function App() {
  // State to hold the input value  
  const [inputValue, setInputValue] = useState(''); 
  //setInputValue("abc")
   
  
   // Handler for input change  
  const handleChange = (event) => {  
  //   // Convert the value to uppercase before setting it in the state  
    setInputValue(event.target.value.toUpperCase());  
  };  

  return (
    <>
    <UpperCaseConverter/>

    <hr />
      <div>  
      <label htmlFor="uppercaseInput">Text : </label>  
      <input  
        id="uppercaseInput"  
        type="text"  
        value={inputValue}  
        onChange={handleChange}  
        placeholder='enter value here in lower'
      />  
      <p>Uppercase Output: {inputValue}</p>  
    </div>  
    <hr/>
    <Calculator/>
    <hr/>
    </>
  )
}

export default App
