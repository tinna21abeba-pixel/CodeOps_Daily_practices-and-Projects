import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Login() {
    const navigate=useNavigate();
    const location=useLocation();
    const form=location.state?.form?.pathname ||'/'
 function handleLogin(){
    localStorage.setItem("isLoggedIn",true);
    navigate(form,{replace:true});
 }
    return(

        <div>
            <h1>Login Page</h1>
            <p>You must login to continue</p>
            <button onClick={handleLogin}>Log in</button>
        </div>
    )
  
}

export default Login