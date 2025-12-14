import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.email },
                        ]
                    });


                    if (!user) {
                        throw new error("no user found")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect password")
                    }
                } catch (error) {
                    throw new error;
                }
            }
        }
        )],
        callbacks:{
        async jwt({ token, user}) {
            if(user){
        token._id = user._id?.toString()
        token.username= user.username
            }
        return token
    },
      async session({ session, token }) {
         if(token){
        session.user._id = user._id?.toString()
        session.user.username= user.username
            }
        return session
        },
  
    },
  pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}