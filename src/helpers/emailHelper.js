import nodemailer from "nodemailer";

export const sendMail = async (emailInfo) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP,
    port: +process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // SMTP user
      pass: process.env.MAIL_PASS, // SMTP password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(emailInfo);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

export const profileUpdateNotification = (userObj) => {
  const emailInfo = {
    from: '"Vendistop"' + process.env.MAIL_USER, // sender address
    to: userObj.email, // list of receivers
    subject: "Your profile has been updated", // Subject line
    text: `Hi ${userObj.fName} we have just noticed that your profile information has been updated, if that wasn't you please contact us immediately`, // plain text body
    html: `
        <p>Hello ${userObj.fName} ${userObj.lName}</p>
        <br/>
        <br/>
        <p>We have just noticed that your profile information has been updated, if that wasn't you please contact us immediately </p>
        <br/>
        <br/>
        

        <br/>
        <br/>

        <p>
        ----------
        <br/>
        Vendistop
        </p>
    `,
  };

  sendMail(emailInfo);
};

export const passwordResetOTP = (obj) => {
  console.log(obj);
  const emailInfo = {
    from: '"Vendistop"' + process.env.MAIL_USER, // sender address
    to: obj.email, // list of receivers
    subject: "OTP for password reset", // Subject line
    text: `Hi ${obj.fName}, please use the following OTP to reset your password: ${obj.otp}`, // plain text body
    html: `
        <p>Hello ${obj.fName}</p>
        <br/>
        <br/>
        <p>Please use the following OTP to reset your password</p>
        <br/>
        <br/>
        <span style="color: red; font-size: 2rem; font-weight: bolder;">${obj.otp}</span>
        <br/>
        <br/>

        <p>
        ----------
        <br/>
        Vendistop
        </p>
    `,
  };

  sendMail(emailInfo);
};
