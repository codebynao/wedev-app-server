'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./../config/default');

const sprintSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(config.PROGRESS_STATUS)
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    tasks: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Task'
        }
      ],
      default: []
    }
  },
  {
    timestamps: true, // Use Mongoose createdAt & updatedAt,
    minimize: false // Force mongoose to return all fields, even when empty
  }
);

module.exports = mongoose.model('Sprint', sprintSchema);
