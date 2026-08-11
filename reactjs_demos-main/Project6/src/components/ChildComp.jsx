import React, { useEffect, useState } from 'react';

function ChildComponent(props) {
    const [select, setSelect]=useState(false)

    const handleChange=(()=>{
        if(select===true)
            setSelect(false)
        else
             setSelect(true)
    })

function calTotal()
{
  handleChange();
  let price=props.price
  if(select===false)
    props.abc(price)
  else
    props.abc(-price)
}

  return (
    <div>
     
      <h2>{props.title}</h2>
      <p>About: {props.content}</p>
      <p>Ticket Price:{props.price}</p>
       <input type="checkbox"  onChange={calTotal} checked={select}></input>
       
    </div>
  );
}

export default ChildComponent;