import React, {createContext} from 'react'
import Child1 from './child1'

const data1=createContext();
const data2=createContext();


export default function Parent() {

  const name="Dipendu"
  const dept="GEA"

  return (
    <div>
      This is Parent Component
      <data1.Provider value={name}>
        <data2.Provider value={dept}>
            <Child1/>
        </data2.Provider>
      </data1.Provider>
    </div>
  )
}

export {data1,data2}
