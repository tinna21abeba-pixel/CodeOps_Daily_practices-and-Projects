

import NavBar from "./NavBar";

export default function Header(){
    return(
        <div className="flex items-center justify-between bg-zinc-900 p-3 mx-2 text-white">
          
            <h1>Addis Eats</h1>
            <NavBar/>
        </div>
    )
}