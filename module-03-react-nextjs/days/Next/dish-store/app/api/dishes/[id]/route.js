import { NextResponse } from "next/server";
import dishes from "@/app/data/Dishes";


  export async function GET(request, {params}) {
    const {id}= await params;

    const dish=dishes.find((dish)=> dish.id===Number(id));

    if(!dish){
        return NextResponse.json(
            {error: "dish not found"},
            {status:404}
        )
    }

    return NextResponse.json({dish});
  }