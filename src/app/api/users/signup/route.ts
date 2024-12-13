import {connect} from "@/dbConfig/dbConfig"

import User from "@/models/userModel"

import {NextRequest, NextResponse} from 'next/server'

//to hash the password
import bcrypt from 'bcryptjs'

//for verification email
import { sendEmail } from '@/utils/mailers'

connect()


export async function POST(request: NextRequest) {

    try {

        const reqBody = await request.json()
        const { username , email, password} = reqBody

        console.log(reqBody);

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

