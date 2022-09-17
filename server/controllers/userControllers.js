const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Verification = require("../models/verificationModel");
const ResetPassword = require("../models/resetPasswordModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("../nodemailer/sendEmail");
const emailVerifyTemplate = require("../nodemailer/emailTemplateVerify");
const emailNewVerify = require("../nodemailer/emailNewVerify");
const emailTemplateResetPassword = require("../nodemailer/emailTemplateResetPassword");

//user login controller
//status codes: (200, 400, 401, 500)
const userLogin = async (req, res) => {
  try {
    const { emailUsername, password } = req.body;
    //check if all fields are not empty
    if (!emailUsername || !password)
      return res.status(400).send("Email/username or password is incorrect");

    //check if user is existing
    const existingUser = await User.findOne({
      $or: [{ email: emailUsername }, { username: emailUsername }]
    });
    if (!existingUser)
      return res.status(400).send("Email/username or password is incorrect");

    //check if password is valid
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.hashedPassword
    );
    if (!isPasswordValid)
      return res.status(400).send("Email/username or password is incorrect");

    //sign tokens if passed all checks
    const accessToken = jwt.sign(
      { userId: existingUser._id },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "10m"
      }
    );
    const refreshToken = jwt.sign(
      { userId: existingUser._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "30d"
      }
    );

    //update refresh token to the database
    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    //send access token through secure http-only cookie
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30 * 1000, //30 days
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : ""
      })
      .status(200)
      .json({
        username: existingUser.username,
        email: existingUser.email,
        isVerified: existingUser.isEmailVerified,
        dateCreated: existingUser.accountCreated,
        activities: existingUser.recent_activities
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//user signup controller
//status codes: (200, 400, 424, 409, 500)
const userSignup = async (req, res) => {
  try {
    let errors = {};
    const { username, email, password, confirmPassword } = req.body;
    //check if all fields are not empty
    if (!email || !username || !password || !confirmPassword)
      return res.status(400).send("All fields are required");

    //check if password is matching
    if (password !== confirmPassword)
      errors.errorPassword = "Password does not match";

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    //check if email and username is existing
    if (existingUsername) errors.errorUsername = "Username is already in use";
    if (existingEmail) errors.errorEmail = "Email is already in use";

    //check if the are any errors
    if (Object.entries(errors).length !== 0)
      return res.status(409).json(errors);

    //encrypt password using bcrypt
    const SALT = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, SALT);

    //sign token for email verification
    const token = jwt.sign({ email }, process.env.VERIFICATION_SECRET, {
      expiresIn: "7d"
    });

    //save user to the database
    const newUser = await User({ email, username, hashedPassword }).save();
    //create a task document
    await Task({ userId: mongoose.Types.ObjectId(newUser._id) }).save();
    //save a verification token to the database
    await Verification({ email, token }).save();

    //send verification to email address
    const isSent = await nodemailer(
      email,
      "Verify Email",
      emailVerifyTemplate(
        username,
        `${process.env.CORS_ORIGIN}/verify/${token}`
      )
    );
    if (isSent !== true) {
      console.error(isSent);
      return res
        .status(424)
        .send(
          "Signup successful. But an error occurred while sending an email verification."
        );
    }

    res.status(200).send(email);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//check user if logged in
//status codes: (200, 401)
const checkUser = async (req, res) => {
  const { access_token } = req.cookies;
  const existingUser = await User.findById(
    jwt.decode(access_token, process.env.ACCESS_SECRET)?.userId
  );

  try {
    //check if cookie is not present or there is no user found
    if (!access_token || !existingUser)
      //clear cookies
      return res
        .cookie("access_token", "", {
          httpOnly: true,
          maxAge: 0,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : ""
        })
        .status(200)
        .send("please login");

    //verify access token
    jwt.verify(access_token, process.env.ACCESS_SECRET);

    //send user information if token is valid
    res.status(200).json({
      username: existingUser.username,
      email: existingUser.email,
      isVerified: existingUser.isEmailVerified,
      dateCreated: existingUser.accountCreated,
      activities: existingUser.recent_activities
    });
  } catch (error) {
    //1st catch block
    //check refresh token from database if token is expired or "Email/username or password is incorrect"

    //send status 401 when token is "Email/username or password is incorrect" signature
    if (error.message === "invalid signature")
      return res
        .cookie("access_token", "", {
          httpOnly: true,
          maxAge: 0,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : ""
        })
        .status(401)
        .send("Unauthorized");

    try {
      //check if there is existing user
      if (!existingUser)
        return res
          .cookie("access_token", "", {
            httpOnly: true,
            maxAge: 0,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : ""
          })
          .status(401)
          .send("Unauthorized");

      //verify refresh token
      jwt.verify(existingUser.refreshToken, process.env.REFRESH_SECRET);
      //sign new token if refresh token is valid
      const newAccessToken = jwt.sign(
        { userId: existingUser._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "10m" }
      );

      //send new access token to https cookie
      res
        .cookie("access_token", newAccessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30 * 1000, //30 days
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : ""
        })
        .status(200)
        .json({
          username: existingUser.username,
          email: existingUser.email,
          isVerified: existingUser.isEmailVerified,
          dateCreated: existingUser.accountCreated,
          activities: existingUser.recent_activities
        });
    } catch (error) {
      res.cookie("access_token", "", {
        httpOnly: true,
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : ""
      });

      //remove refresh token from the database
      existingUser.refreshToken = "";
      await existingUser.save();

      res.status(403).send("Session expired. Please re-login to your account");
    }
  }
};

//user logout controller
//status codes: (200, 500)
const userLogout = async (req, res) => {
  try {
    //clear access and refresh token
    await User.findOneAndUpdate({ _id: req.user }, { refreshToken: "" });

    res
      .cookie("access_token", "", {
        httpOnly: true,
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : ""
      })
      .status(200)
      .send();
  } catch (error) {
    console.error(error.message);

    res
      .cookie("access_token", "", {
        httpOnly: true,
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : ""
      })
      .status(500)
      .send("Internal Server Error");
  }
};

//forgot password controller
//status codes: (200, 400, 404, 500)
const forgotPassword = async (req, res) => {
  try {
    const { emailUsername } = req.body;
    const existingUser = await User.findOne({
      $or: [{ username: emailUsername }, { email: emailUsername }]
    });

    //check if field is empty
    if (!emailUsername)
      return res.status(400).send("Email or username is required");

    //check if there is existing user with given credentials
    if (!existingUser)
      return res
        .status(404)
        .send("No user found associated with the given credential");

    //check if email is verified
    if (!existingUser.isEmailVerified) {
      //sign new verification if email is not yet verified
      const newVerification = jwt.sign(
        { email: existingUser.email },
        process.env.VERIFICATION_SECRET,
        { expiresIn: "7d" }
      );

      //send new email verification
      const isSent = await nodemailer(
        existingUser.email,
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
          .send(
            "Resending verification error. Your email is not yet verified, unable to send new email verification"
          );
      }

      //replace verification token if there is existing user, if not insert one
      await Verification.findOneAndUpdate(
        { email: existingUser.email },
        { token: newVerification },
        { upsert: true }
      );

      return res
        .status(400)
        .send(
          `Your email is not yet verified. We sent an email to ${existingUser.email}. Please verify your email to be able to reset your password`
        );
    }

    //sign reset password token
    const resetToken = jwt.sign(
      { email: existingUser.email },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: "7d" }
    );

    //send email reset password
    const isSentResetPassword = await nodemailer(
      existingUser.email,
      "Reset Password",
      emailTemplateResetPassword(
        existingUser.username,
        `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`,
        `${process.env.CORS_ORIGIN}/request/reset-password/${resetToken}/remove`
      )
    );
    if (isSentResetPassword !== true) {
      console.error(isSent);
      return res
        .status(500)
        .send(
          "Unable to reset password, an error occurred while sending an email to reset password"
        );
    }

    //replace reset password token if there is existing user, if not insert one
    await ResetPassword.findOneAndUpdate(
      { email: existingUser.email },
      { resetToken },
      { upsert: true }
    );

    res
      .status(200)
      .send(
        `An email was sent to ${existingUser.email} to reset password. Please check your inbox or spam folders`
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//validate forgot password controller
//status codes: (200, 404, 500)
const validateResetPasswordToken = async (req, res) => {
  try {
    const { resetToken } = req.params;

    //check if reset token is empty
    if (!resetToken) return res.status(404).send("Token not found");

    //validate if token is valid and not expired
    const verifiedToken = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_SECRET
    );

    //validate token payload
    const existingResetRequest = await ResetPassword.findOne({
      email: verifiedToken.email
    });

    //validate if there is an associated user in request
    const existingUser = await User.findOne({ email: verifiedToken.email });

    //check if existing request is empty
    if (!existingResetRequest) return res.status(404).send("Invalid token");

    //check is there is existing user
    if (!existingUser)
      return res.status(404).send("Invalid token: No user found");

    res.status(200).send("Valid token");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//change password in forgot password
//status codes: (200, 400, 404, 500)
const forgotPasswordUpdate = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    //check if reset token is empty
    if (!resetToken) return res.status(404).send("Token not found");

    //validate if token is valid or expired
    const verifiedToken = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_SECRET
    );

    //find associated user
    const existingUser = await User.findOne({ email: verifiedToken.email });

    //check is there is existing user
    if (!existingUser)
      return res.status(404).send("Invalid token: No user found");

    //check if new password is same as old password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.hashedPassword
    );
    if (isSamePassword)
      return res
        .status(400)
        .send("New password must not be the same as your old password");

    //encrypt new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //update password on database
    existingUser.hashedPassword = hashedPassword;
    await existingUser.save();

    //delete request record on database
    await ResetPassword.findOneAndDelete({ email: verifiedToken.email });

    res.status(200).send("Password changed, you may now login to your account");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//delete reset password token
//status codes: (200, 404, 500)
const disregardResetToken = async (req, res) => {
  try {
    const { resetToken } = req.params;

    //check if reset token is empty
    if (!resetToken) return res.status(404).send("Token not found");

    //check if reset token is expired or valid
    const verifiedToken = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_SECRET
    );

    //check if there is existing reset request
    const existingResetRequest = await ResetPassword.findOne({
      email: verifiedToken.email
    });
    if (!existingResetRequest) return res.status(404).send("No request found");

    //delete reset token
    await ResetPassword.findOneAndDelete({ email: verifiedToken.email });

    res.status(200).send("Reset password link is deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//edit username controller
//status codes: (200, 500)
const editUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findById(req.user);

    if (!username)
      return res.statue(400).send("Cannot update username. Empty body");

    //change username
    existingUser.username = username;
    const savedData = await existingUser.save();

    res.status(200).json({
      username: savedData.username,
      email: savedData.email,
      isVerified: savedData.isEmailVerified,
      dateCreated: savedData.accountCreated
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error(error.message);
      return res.status(500).send("Username is already taken");
    }
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//change email address controller
//status codes: (200, 400, 500)
const changeEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findById(req.user);

    if (!email) return res.status(400).send("Cannot update email. Empty body");

    //sign new verification token
    const newVerification = jwt.sign(
      { email },
      process.env.VERIFICATION_SECRET,
      { expiresIn: "7d" }
    );

    //add new verification
    await Verification({ email, token: newVerification }).save();

    //change email and email status
    existingUser.email = email;
    existingUser.isEmailVerified = false;
    const savedData = await existingUser.save();

    //send new email verification
    const isSent = await nodemailer(
      email,
      "Verify New Email",
      emailNewVerify(
        existingUser.username,
        `${process.env.CORS_ORIGIN}/verify/${newVerification}`
      )
    );
    if (isSent !== true) {
      console.error(isSent);
      return res
        .status(500)
        .send(
          "Email address is changed. But an error occurred while sending an email verification."
        );
    }

    res.status(200).json({
      username: savedData.username,
      email: savedData.email,
      isVerified: savedData.isEmailVerified,
      dateCreated: savedData.accountCreated
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error(error.message);
      return res.status(500).send("Email is already taken");
    }
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//change password controller
//status codes: (200, 400, 500)
const changePassword = async (req, res) => {
  try {
    const { newPassword, currentPassword } = req.body;
    const existingUser = await User.findById(req.user);

    //check if new password is empty
    if (!newPassword) return res.status(400).send("Your new password is empty");

    //check if current and new password is same
    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.hashedPassword
    );
    if (isSamePassword)
      return res
        .status(400)
        .send("New password must not be the same as your current password");

    //check if last password is correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      existingUser.hashedPassword
    );
    if (!isPasswordValid)
      return res.status(400).send("Current password is incorrect");

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //update password on database
    existingUser.hashedPassword = hashedPassword;
    await existingUser.save();

    res.status(200).send("Password changed");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//delete account controller
//status codes: (200, 400, 500)
const deleteAccount = async (req, res) => {
  try {
    const { confirmPassword } = req.body;
    const existingUser = await User.findById(req.user);

    //check if confirm password is empty
    if (!confirmPassword)
      return res.status(400).send("Please enter your password");

    //check password if valid
    const isPasswordValid = await bcrypt.compare(
      confirmPassword,
      existingUser.hashedPassword
    );
    if (!isPasswordValid) return res.status(400).send("Password is incorrect");

    //delete all data from the user
    await Task.findOneAndDelete({ userId: req.user });
    await Verification.findOneAndDelete({ email: existingUser.email });
    await ResetPassword.findOneAndDelete({ email: existingUser.email });
    await User.findByIdAndDelete(req.user);

    res
      .cookie("access_token", "", {
        httpOnly: true,
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : ""
      })
      .status(200)
      .send("Account successfully deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  userLogin,
  userSignup,
  checkUser,
  userLogout,
  forgotPassword,
  validateResetPasswordToken,
  disregardResetToken,
  forgotPasswordUpdate,
  editUsername,
  changeEmail,
  changePassword,
  deleteAccount
};
