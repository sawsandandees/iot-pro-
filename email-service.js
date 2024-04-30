import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

let transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD
  }
});

export const sendEmail = (email) => {
  let mailOptions = {
    from: `${process.env.NODE_MAILER_USER_NAME} ${process.env.NODE_MAILER_EMAIL}`,
    to: email,
    subject: 'TEMPERATURE ALERT !! ⚠️',
    html: '<b>WATCH OUT!</b><p>You received this email because the temperature level on your house is too high<br> please take any necessary action to prevent any potential risk or damage </p>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}