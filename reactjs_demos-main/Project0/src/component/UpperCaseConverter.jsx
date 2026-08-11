import React, { useState } from 'react';  

function UpperCaseConverter() {  
  const [inputValue, setInputValue] = useState('');  
  

  const handleInputChange = (event) => {  
    setInputValue(event.target.value);  
  };  

  const convertToUpperCase = () => {  
        setInputValue(inputValue.toUpperCase());  
    
  };  

  return (  
    <>
    <div>  
      Enter name : <input type="text" value={inputValue} onChange={handleInputChange}  placeholder="enter here..."/> 
      <button onClick={convertToUpperCase} className="btn btn-primary">  Convert to Upper Case
    </button>  
      <p>Output: {inputValue}</p>  
    </div> 
    </>
  );  
}  
export default UpperCaseConverter; 