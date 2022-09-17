const Verification = require("../models/verificationModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const emailVerifyTemplate = require("../nodemailer/emailTemplateVerify");
const emailVerifiedTemplate = require("../nodemailer/emailTemplateVerified");
const nodemailer = require("../nodemailer/sendEmail");
const INVALID_TOKEN = "This verification link is invalid or already used";

//verify email controller
//status codes: (200, 400, 500)
const verifyEmail = async (req, res) => {
  try {
    const verificationToken = req.params.token;
    //check is token is not empty
    if (!verificationToken) return res.status(400).send(INVALID_TOKEN);

    //check if existing user is not empty
    const existingUser = await Verification.findOne({
      token: verificationToken
    });
    if (!existingUser) return res.status(400).send(INVALID_TOKEN);

    //verify token
    const verified = jwt.verify(
      existingUser.token,
      process.env.VERIFICATION_SECRET
    );

    //update verification status and delete verification token on database if pass all checks
    await User.findOneAndUpdate(
      { email: verified.email },
      { isEmailVerified: true }
    );
    await Verification.findOneAndDelete({ token: existingUser.token });

    //send email that account is verified
    const isSent = await nodemailer(
      existingUser.email,
      "Email Verified",
      emailVerifiedTemplate()
    );
    if (isSent !== true) {
      console.error(isSent);
      return res
        .status(500)
        .send(
          "Your email is verified but an error occured while sending an email confirmation."
        );
    }

    res.status(200).send("Your email is verified.");
  } catch (error) {
    if (
      error.message === "jwt expired" ||
      error.message === "invalid signature"
    )
      res.status(400).send(INVALID_TOKEN);
    else {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
};

//resend email verification controller
//status codes: (200, 400, 409, 500)
const resendVerification = async (req, res) => {
  try {
    //check if email is empty
    const { email } = req.body;
    if (!email)
      return res.status(400).send("Cannot send email. Email address is empty");

    //fetch user from the database
    const existingUser = await User.findOne({ email });
    //check if there is exisiting user
    if (!existingUser)
      return res
        .status(400)
        .send("Cannot send email. Email address is not registered");

    //check if email is already verified
    if (existingUser.isEmailVerified === true)
      return res.status(409).send("The email address used is already verified");

    //sign new verification token if pass all checks
    const newVerification = jwt.sign(
      { email },
      process.env.VERIFICATION_SECRET,
      { expiresIn: "7d" }
    );

    //send new email verification
    const isSent = await nodemailer(
      email,
      "Verify Email",
      emailVerifyTemplate(
        existingUser.username,
        `${process.env.CORS_ORIGIN}/verify/${newVerification}`
      )
    );
    if (isSent !== true) {
      console.error(isSent);
      return res
        .status(500)
        .send("Resending verification error. Unable to send email");
    }

    //replace verification token if there is existing user, if not insert one
    await Verification.findOneAndUpdate(
      { email },
      { token: newVerification },
      { upsert: true }
    );

    res.status(200).send(email);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  verifyEmail,
  resendVerification
};
