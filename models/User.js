import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true,unique:true },
        Username: { type: String, required: false },
        password: { type: String, required: true },
    },{
        timestamps:true
    }
);

userSchema.pre("save",async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
});
const User = mongoose.models?.User || mongoose.model("User",userSchema);

export default User;
