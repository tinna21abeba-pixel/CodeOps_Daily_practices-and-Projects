"use client"
 import {useRouter} from "next/navigation";

 export default function MenuButton({dish}) {
    const router = useRouter();
     function GotoMenu(){
        router.push("/menu");
     }
    return (
        <button onClick={GotoMenu}>
           view our  menu
        </button>
    )
}