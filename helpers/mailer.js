import User from '@/models/User';
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'

export const sendEmail = async ({ email, emailType, userId }) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            const updatefUser = await User.findByIdAndUpdate
                (userId, {
                    $set:{
                    verifyToken: hashedToken,
                     verifyTokenExpiry: Date.now() + 
                     3600000  }
                }
                )

        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,

                {$set:{
                 forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }}
            )
        }
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "097ba09734809b",
                pass: "85b979ee6173ca"
            }
        });

        const mailOptions = {
            from: 'yaqoob.tariq12@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: ` <p>Click <a href="${process.env.Domain}/verifyemail?Token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your passwprd"} or copy and paste the link below in the browser 
    <br>${process.env.Domain}/verifyemail?token=${hashedToken}
    </p>
`,
        }
        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse
    } catch (error) {
        throw new Error(error.message)
    }
}