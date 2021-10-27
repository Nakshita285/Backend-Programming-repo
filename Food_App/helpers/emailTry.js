const nodemailer = require("nodemailer");
// const config = require("../secrets");

module.exports = async function main(token, userEmail) {

  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    secure: true, 
    auth: {
      user: "nakshita.62@gmail.com", 
      pass: config.APP_PASSWORD // different from the login password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <contact@gmail.com>', // sender address
    to: "nakshita.malhotra.61@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line

    text: "Hello world!!   ", // plain text body
    html: `<b>Hello User</b><br><p>your Otp is ${token}</p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


