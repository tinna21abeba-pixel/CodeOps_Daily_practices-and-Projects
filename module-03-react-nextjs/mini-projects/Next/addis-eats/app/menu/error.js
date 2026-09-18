 "use client"

 export default function Error(reset){ 
    return (
        <div>
            <h1>Sorry, something went wrong!</h1>
            <button onClick={()=>reset()}>Try again</button>
        </div>
    )
 }