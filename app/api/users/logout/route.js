import dbConnect from "@/lib/dbConnect";
import User from '@/models/User'
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

export async function GET(request) {
try {
        const response = NextResponse.json({
            message:"Logout Successfull",
            success:true
        })
        response.cookies.set("token","",{
            httpOnly:true,
            expires:new Date(0)
        },)
        return response
} catch (error) {
     return NextResponse.json({error:error.message},
            {status:500}
        )
}
}