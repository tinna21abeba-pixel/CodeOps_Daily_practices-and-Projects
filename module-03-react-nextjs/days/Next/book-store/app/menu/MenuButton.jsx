"use client"
 import {useRouter} from "next/navigation";

 export default function MenuButton({dish}) {
    const router = useRouter();
     function GotoMenu(){
        router.push("/menu");
     }
    return (
        <button onClick={GotoMenu} className="bg-orange-500 text-white p-2 rounded-lg cursor-pointer">
           view our  menu
        </button>
    )
}