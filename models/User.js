'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    lastName: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    company: {
      type: String,
      default: undefined
    },
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true, // Use Mongoose createdAt & updatedAt,
    minimize: false // Force mongoose to return all fields, even when empty
  }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
