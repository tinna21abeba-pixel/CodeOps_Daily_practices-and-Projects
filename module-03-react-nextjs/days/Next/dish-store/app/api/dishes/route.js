import { NextResponse } from "next/server";
import dishes from "@/app/data/Dishes";
export async function GET(){
    return NextResponse.json({dishes})
}

