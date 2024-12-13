import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{ 
        type: String,
        required: [true , "Please proide an username"],
        unique: true
    },
    email: {
        type: String,
        required: [true , "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true , "Please provide"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})
//special case in nextjs
const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User