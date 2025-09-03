// backend/models/User.js - UPDATE NOTIFICATION FIELDS
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    trim: true,
  },
  profession: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },

  // 2FA Fields
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
  },
  twoFactorTempSecret: {
    type: String,
  },

  // UPDATED Notification Settings - REPLACE YOUR EXISTING ONES
  emailNotifications: {
    type: {
      newJobs: {
        type: Boolean,
        default: true,
      },
      newsUpdates: {
        type: Boolean,
        default: true,
      },
      interviewSchedule: {
        type: Boolean,
        default: true,
      },
      jobRejection: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
    },
    default: function () {
      return {
        newJobs: true,
        newsUpdates: true,
        interviewSchedule: true,
        jobRejection: true,
        marketing: false,
        weeklyDigest: true,
      };
    },
  },
  pushNotifications: {
    type: {
      newJobs: {
        type: Boolean,
        default: true,
      },
      newsUpdates: {
        type: Boolean,
        default: true,
      },
      interviewSchedule: {
        type: Boolean,
        default: true,
      },
      jobRejection: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
      weeklyDigest: {
        type: Boolean,
        default: false,
      },
    },
    default: function () {
      return {
        newJobs: true,
        newsUpdates: true,
        interviewSchedule: true,
        jobRejection: true,
        marketing: false,
        weeklyDigest: false,
      };
    },
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    console.log("Hashing password for user:", this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    console.log(`Comparing passwords for user: ${this.email}`);
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log(`Password match result: ${isMatch}`);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
