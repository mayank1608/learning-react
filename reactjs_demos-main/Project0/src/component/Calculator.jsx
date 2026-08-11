import React, { useState } from 'react';  



 function Calculator() {
      
        const [input, setInput] = useState('');  
        const [result, setResult] = useState('');  
      
        const handleButtonClick = (value) => {  
           if(input.length>0 && input.slice(0,1)==='0')
             setInput(value);  
           else
            setInput(input + value); 
        };  
      
        const handleClear = () => {  
          setInput('');  
          setResult('');  
        };  
      
        const handleCalculate = () => {  
          try {  
            // Use eval for simplicity; in real applications, avoid using eval for safety  
            const calculatedResult = eval(input);   
            setResult(calculatedResult);  
            //setInput('');  
          } catch (error) {  
            setResult('Error');  
          }  
        };  
      
        return (  
          <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>  
            <h2>Calculator</h2>  
            <div style={{ marginBottom: '10px' }}>  
              <input   
                type="text"   
                value={input}   
                readOnly   
                style={{ width: '100%', padding: '10px', fontSize: '18px' }}   
              />  
            </div>  
            <div style={{ marginBottom: '10px' }}>  
              <input   
                type="text"   
                value={result}   
                readOnly   
                style={{ width: '100%', padding: '10px', fontSize: '18px' }}   
              />  
            </div>  
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>  
              <button onClick={() => handleButtonClick('1')}>1</button>  
              <button onClick={() => handleButtonClick('2')}>2</button>  
              <button onClick={() => handleButtonClick('3')}>3</button>  
              <button onClick={() => handleButtonClick('+')}>+</button>  
      
              <button onClick={() => handleButtonClick('4')}>4</button>  
              <button onClick={() => handleButtonClick('5')}>5</button>  
              <button onClick={() => handleButtonClick('6')}>6</button>  
              <button onClick={() => handleButtonClick('-')}>-</button>  
      
              <button onClick={() => handleButtonClick('7')}>7</button>  
              <button onClick={() => handleButtonClick('8')}>8</button>  
              <button onClick={() => handleButtonClick('9')}>9</button>  
              <button onClick={() => handleButtonClick('*')}>*</button>  
      
              <button onClick={handleClear}>C</button>  
              <button onClick={() => handleButtonClick('0')}>0</button>  
              <button onClick={handleCalculate}>=</button>  
              <button onClick={() => handleButtonClick('/')}>/</button>  
            </div>  
          </div>  
        );  
      };  
      
      export default Calculator;  