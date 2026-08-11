import React from 'react'
import { NavLink ,Outlet} from 'react-router-dom'

function Navbar() {
  return (
   <>
   <ul>
       <li><NavLink to="/home" activeStyle={{ fontWeight: 'bold' }}>Home</NavLink></li>
       <li> <NavLink to="/about" activeStyle={{ fontWeight: 'bold' }}>About us </NavLink> </li>
       <li> <NavLink to="/forms" activeStyle={{ fontWeight: 'bold' }}>Sign Up</NavLink> </li>
       <li> <NavLink to="/contact" activeStyle={{ fontWeight: 'bold' }}>Contact us</NavLink> </li>
     </ul>
      <p><Outlet/></p>
    
    </>
   
   
  )
}

export default Navbar
