'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./../config/default');

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: undefined
    },
    status: {
      type: String,
      enum: Object.values(config.PROGRESS_STATUS),
      required: true
    },
    startDate: {
      type: Date,
      default: undefined
    },
    endDate: {
      type: Date,
      default: undefined
    },
    completionTime: {
      type: String,
      default: undefined
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    sprint: {
      type: Schema.Types.ObjectId,
      ref: 'Sprint',
      default: undefined
    }
  },
  {
    timestamps: true, // Use Mongoose createdAt & updatedAt,
    minimize: false // Force mongoose to return all fields, even when empty
  }
);

module.exports = mongoose.model('Task', taskSchema);
