const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) create a transporter - the service the sends the email (it's not node.js - something like gmail)
  const transporter = nodemailer.createTransport({
    //service: "Gmail", - instead of {host, port} we could simply specify a soported service
    //yahoo, hotmail, sendgrid, mailgun, etc. - these are other services
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) define the email options
  const mailOptions = {
    from: "Gustavo Zapata <tavordie@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<h2>Reset your password</h2><p>${options.message}</p>`,
  };

  //3) actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
