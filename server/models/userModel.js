const mongoose = require("mongoose");

const EMAIL_VALIDATOR =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const USERNAME_VALIDATOR = /^[a-z0-9]([._-](?![._-])|[a-z0-9]){3,18}[a-z0-9]$/;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    min: [5, "Username must be at least 5 characters"],
    max: [20, "Username must be maximum of 20 characters only"],
    required: [true, "Username is required"],
    trim: true,
    unique: [true, "Username is already in use"],
    validate: {
      validator: (username) => {
        return USERNAME_VALIDATOR.test(username);
      },
      message:
        "Username must only contain lowercase letters, numbers, and underscore. No underscore at the beginning and ending of the username."
    }
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already in use"],
    trim: true,
    validate: {
      validator: function (email) {
        return EMAIL_VALIDATOR.test(email);
      },
      message: "Enter a valid email"
    }
  },
  hashedPassword: {
    type: String,
    required: [true, "Password is required"]
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String,
    default: ""
  },
  accountCreated: {
    type: Date,
    default: () => {
      return Date.now();
    }
  },
  recent_activities: [
    {
      event: {
        type: String
      },
      date: {
        type: Date,
        default: () => {
          return Date.now();
        }
      }
    }
  ]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
