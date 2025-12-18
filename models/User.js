import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true,unique:true },
        username: {  type: String, required: true,unique:true},
        password: { type: String, required: true },
        isVerified:{
            type:Boolean,
            default: false
        },
        isAdmin:{
            type:Boolean,
            default :false
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date
    
    },{
        timestamps:true
    }
);


const User = mongoose.models?.User || mongoose.model("User",userSchema);

export default User;
