import React from 'react'
import {Link, NavLink} from 'react-router-dom'

function NavBar() {
  return (
    <nav>
        <Link to="/"> Home</Link>
        <NavLink to="/about" className={({isActive})=>isActive? 'active':''}> About</NavLink>
        <NavLink to="/contact" className={({isActive})=>isActive?'active' :''}> Contact</NavLink>
        <NavLink to="/menu" className={({isActive})=>isActive?'active' :''}> Menu</NavLink>
        <NavLink to="/login">Login</NavLink>
    </nav>
  )
}

export default NavBar