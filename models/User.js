'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const config = require('./../config/default');

const userSchema = new Schema(
  {
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    company: {
      type: String,
      trim: true,
      default: undefined
    },
    siret: {
      type: String,
      minLength: config.LENGTH_SIRET,
      maxLength: config.LENGTH_SIRET
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: config.MINIMUM_LENGTH_PASSWORD
    },
    phone: {
      type: String,
      trim: true,
      default: undefined
    },
    companyStatus: {
      type: String,
      enum: Object.values(config.COMPANY_STATUS),
      default: config.COMPANY_STATUS.OTHER
    },
    professionalStatus: {
      type: String,
      enum: Object.values(config.PROFESSIONAL_STATUS),
      default: config.PROFESSIONAL_STATUS.OTHER
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
