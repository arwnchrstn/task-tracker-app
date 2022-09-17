const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  },
  port: 465,
  host: "smtp.gmail.com"
});

module.exports = async (to, subject, html) => {
  try {
    await mailTransporter.sendMail({
      from: `TakaTask ${process.env.GMAIL_USER}`,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    return error.message;
  }
};
