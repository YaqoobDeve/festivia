import dbConnect from "@/lib/dbConnect";
import User from '@/models/User'
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

export async function POST(request) {
    try {
        await dbConnect()
        const reqBody = await request.json()
        const {username,email,password}=reqBody
        console.log(reqBody)

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json({error:"User already exist"},{status:400})
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt)
        const newUser = new User({
           username,
           email,
           password:hashedPassword
        })
        const savedUser = await newUser.save()
        console.log(savedUser)
        //send mail
        await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})
        return NextResponse.json({
            message:"User registered succesfully",
            success:true,
            savedUser
        })

    } catch (error) {
        return NextResponse.json({error:error.message},
            {status:500}
        )
    }
}