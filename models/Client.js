'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    corporateName: {
      type: String,
      trim: true,
      required: true
    },
    contact: {
      type: {
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
        // At least one medium of contact
        phone: {
          type: String,
          trim: true,
          required: () => {
            return !this.email;
          }
        },
        email: {
          type: String,
          trim: true,
          required: () => {
            return !this.phone;
          }
        }
      },
      required: true
    },
    address: {
      type: {
        street: {
          type: String,
          trim: true,
          default: undefined
        },
        zipcode: {
          type: String,
          trim: true,
          required: true
        },
        city: {
          type: String,
          trim: true,
          required: true
        },
        country: {
          type: String,
          trim: true,
          required: true
        },
        additionalInformation: {
          type: String,
          trim: true,
          default: undefined
        }
      },
      default: undefined
    },
    projects: [],
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // Use Mongoose createdAt & updatedAt,
    minimize: false // Force mongoose to return all fields, even when empty
  }
);

clientSchema.index({ corporateName: 1 });

module.exports = mongoose.model('Client', clientSchema);
