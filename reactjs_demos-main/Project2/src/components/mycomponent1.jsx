import React, { useState ,useRef} from 'react'

export default function MyComponent1() {

    const refElement=useRef("NA");
    console.log(refElement)
    console.log("current property:"+refElement.current);


    const [name,setName]=useState("Genesis")

    function reset()
    {
      setName("")
      refElement.current.focus()     
      refElement.current.style.color="red" 
    }
  return (
    <>
    <h3>Learning UseRef Hooks</h3>
      <input ref={refElement} type="text" value={name} onChange={(event)=>{
        setName(event.target.value)
        console.log(name)
      }}></input>

      <button onClick={reset}>Reset</button>
    
      
      
    </>
  )
}
