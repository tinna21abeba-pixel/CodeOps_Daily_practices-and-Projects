import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function RequireAuth({children}) {
    const location=useLocation();
    const isLoggedin=localStorage.getItem("isLoggedIn")
    if(!isLoggedin){
        return <Navigate to="/login" replace state={{form:location}}/>
    }
    return children
}

export default RequireAuth