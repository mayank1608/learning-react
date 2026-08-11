import React from 'react'
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <div>
      <nav>
      <NavLink to="/home" activeStyle={{ fontWeight: 'bold' }}>Home</NavLink> <br/>
      <NavLink to="/about" activeStyle={{ fontWeight: 'bold' }}>About us </NavLink> <br/>
      <NavLink to="/forms" activeStyle={{ fontWeight: 'bold' }}>Registration</NavLink> <br/>
    </nav>
    </div>
  )
}
