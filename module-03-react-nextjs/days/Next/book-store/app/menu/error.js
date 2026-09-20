"use client"

export default function error({reset}){
    return(
        <div>
            <h1>Sorry, there was an error loading the menu! Please try again later.</h1>
            <button onClick={()=>reset()}>Try Again</button>
        </div>
    )
}