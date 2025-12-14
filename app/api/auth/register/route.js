import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
try{
    const {email,password}= await request.json()
    if(!email||!password){
        return NextResponse.json(
            {error:"email and password are required"},
            {
                status:400
            }

        )
    }
    await dbConnect()
    const existingUser =await User.findOne({email})
    if(!existingUser){
        return NextResponse.json(
            {error:"Email is already registered"},
            {status:"400"}
        )
    }
    await User.create({
        email,
        password
    })
     return NextResponse.json(
            {messaege:"User registered succesfully "},
            {status:"201"}
        )}catch(error){
            return NextResponse.json(
            {messaege:"failed to register"},
            {status:"500"})
        }
}