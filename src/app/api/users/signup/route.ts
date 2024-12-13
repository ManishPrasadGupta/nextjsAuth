import {connect} from "@/dbConfig/dbConfig"

//user ko signup karwana hain toh `user` toh lagega
import User from "@/models/userModel"

//jab connection kar rahe hain toh kuch na kuch data toh lenge naa aur data lene ka tarika `POST` hain `GET` hain.
///data nextjs mein lene ka ek unique tarika hota hain.
//jaha server ki functionality likhi huwi hain waha se data lena hota hain
//request response chaiye hummein
import {NextRequest, NextResponse} from 'next/server'

//to hash the password
import bcrypt from 'bcryptjs'

//for verification email
import { sendEmail } from '@/utils/mailers'

connect()

//is route ke andar abhi functionality likhte hai kaunsa method ane wala hain GET ya POST
// POST --> request
export async function POST(request: NextRequest) {
    //database deta hain bhar bhar ke error toh `try-catch` toh lagana hi hogaaa.
    try {
        //how to get data
        //nextJS ke andar koi middleware use nahi karna Padhta express ki tarah
        const reqBody = await request.json()

        //destructure karke values ko nikal lo.
        const { username , email, password} = reqBody

        //validation
        console.log(reqBody);

        //user ko register karwana hain
        //foolow the steps which I learnt in backend series.
    //steps
        // 1. check user exists or not
        const user = await User.findOne({email})
        console.log(user)

        if(user) {
            return NextResponse.json({error: "user already exist"}, {status: 400})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        console.log(savedUser)


        //send verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "user registered Successfully",
            success: true,
            savedUser
        })


    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    
    }
}

