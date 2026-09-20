
 import Link from "next/link"
export default function navBar(){
    return(
        <div>
           
           <nav className="flex  text-center gap-2">
            <Link href={"/"}>Home</Link>
            <Link href={"/menu"}>menu</Link>
            <Link href={"/cart"}>Cart</Link>
            <Link href={"/checkout"}>checkOut</Link>

           </nav>
        </div>
    )
}