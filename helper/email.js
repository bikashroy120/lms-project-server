import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'estelle2@ethereal.email',
        pass: 'n6Fm78hRC6mjgH4GRw'
    }
});
const emailWithNodemailler = async(mailData)=>{

        try {           
            const mailOption = {
                from: 'vincent.ernser@ethereal.email', // sender address
                to: mailData.email, // list of receivers
                subject: mailData.subject, // Subject line
                html: mailData.html, // html body
            }

            const info = await transporter.sendMail(mailOption)
            console.log(info.response)

        } catch (error) {   
            console.log(error)
            throw error
        }
}

export default emailWithNodemailler;