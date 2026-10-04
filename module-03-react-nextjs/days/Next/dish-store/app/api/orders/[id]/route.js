 import { NextResponse } from "next/server";
 import { findOrder } from "@/app/lib/orders";
 
 export async function GET(request, {params}){
    const {id}=await params;
    const order=await findOrder(Number(id));

    if(!order){
        return NextResponse.json({error:"order not found"},{status:404});
    }
    return NextResponse.json({order});
    
 }