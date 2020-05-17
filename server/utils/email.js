const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
const dotenv = require("dotenv");

dotenv.config();

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email), (this.firstName = user.name);
    this.url = url;
    this.from = `Zona <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid", //we don't have to specify host or port since SendGrid is natively supported by nodemailer
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      //service: "Gmail", - instead of {host, port} we could simply specify a soported service
      //yahoo, hotmail, sendgrid, mailgun, etc. - these are other services
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //send the actual email
  async send(template, subject) {
    //1. render html based on a pug template
    const html = pug.renderFile(
      //this takes a file and renders the pug code into real html
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    //2. define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //3. create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Zona!");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Reset your password");
  }
};
