const mongoose = require("mongoose");

const EMAIL_VALIDATOR =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const resetPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already in use"],
    validate: {
      validator: function (email) {
        return EMAIL_VALIDATOR.test(email);
      },
      message: "Enter a valid email"
    }
  },
  resetToken: {
    type: String,
    required: [true, "Reset token is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const ResetPassword = mongoose.model("resetPassword", resetPasswordSchema);

module.exports = ResetPassword;
