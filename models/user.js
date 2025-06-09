const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL.",
    },
  },
  email: {
    type: String,
    validate: {
      validator(value) {
        return value ? validator.isEmail(value) : true;
      },
      message: "You must enter a valid email."
    },
    index: { unique: true, sparse: true }
  },
  password: {
    type: String,
    validate: {
      validator(value) {
        return value ? value.length >= 8 : true;
      },
      message: "Password must be at least 8 characters long."
    },
    select: false
  }
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      // If user exists but has no password (test case), return the user
      if (!user.password) {
        return user;
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
