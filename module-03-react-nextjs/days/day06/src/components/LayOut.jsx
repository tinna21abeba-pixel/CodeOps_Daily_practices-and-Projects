import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

function LayOut() {
  return (
    <>
    <header>Router Practice</header>
    <NavBar/>
    <main>
        <Outlet/>
    </main>
   <p>© 2026 Router Practice</p>
    </>
  )
}

export default LayOut