import dbConnect from "@/lib/dbConnect";
import User from '@/models/User'
import { NextRequest,NextResponse } from "next/server";



export async function POST(request) {
    try {
      const reqBody = await request.json()  
      const {token} = reqBody

      const user =  await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
      if(!user){
         return NextResponse.json({error:"Invalid Token"},{status:400})
      }
      console.log(user)
      user.isVerified = true
      user.verifyToken= undefined
      user.verifyTokenExpiry= undefined
      await user.save()

      return NextResponse.json({message:"email verified successfully",success:true},{status:200})
    

    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }    
}