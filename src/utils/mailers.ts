// we will use Nodemailer software for this...

import User from '@/models/userModel'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'


export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, {
                $set: {
                  verifyToken:hashedToken, 
                  verifyTokenExpiry: Date.now() + 3600000 
                }

        });
          }else if(emailType=== "RESET") {
                await User.findByIdAndUpdate(userId,  {
                  $set: {
                    forgotPasswordToken:hashedToken , 
                      forgotPasswordTokenExpiry : new Date(
                      Date.now() + 3600000 )
                    }
          });
        }

        //brought it from mailTrap website
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
          });


            const mailOptions = {
              from: 'maaannn197@gmail.com', // sender address
              to: email, 
              subject: emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
              html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
              or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
              </p>`

            }

            const mailResponse = await transporter.sendMail(mailOptions)
            return  mailResponse
        
    } catch (error:any)  // here putting any to define datatype of error
    {
        throw new Error(error.message)
    }

}