const mongoose = require("mongoose");

const EMAIL_VALIDATOR =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const verificationSchema = new mongoose.Schema({
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
  token: {
    type: String,
    required: [true, "Token is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Verification = mongoose.model("emailVerification", verificationSchema);

module.exports = Verification;
