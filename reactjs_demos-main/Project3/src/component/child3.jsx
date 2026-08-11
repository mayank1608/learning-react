import React, {useContext} from 'react'
import {data1,data2} from './parent'



export default function Child3() {

    const myData1=useContext(data1);
    const myData2=useContext(data2);
    
  return (
    <div>
       This is Child3 Component
       <hr color="red"></hr>
       Welcome {myData1} from {myData2} department.
    </div>
  )
}
