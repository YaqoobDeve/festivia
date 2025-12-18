import dbConnect from "@/lib/dbConnect";
import User from '@/models/User'
import { NextRequest,NextResponse } from "next/server";
import getDataFromToken from "@/helpers/getDataFromToken";

export async function POST(request) {
try {
     await dbConnect()
       const userId = await getDataFromToken(request)
       const user = await User.findOne({_id:userId}).select("-password")
       if(!user){
        return NextResponse.json({
            message:"user not found",
            status:500
        })
       }
       return NextResponse.json({
        message:"User found",
        data: user
       })

} catch (error) {
     return NextResponse.json({error:error.message},
            {status:500}
        )
}
}