'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const config = require('./../config/default');
const stacks = require('./../config/stacks');

const projectSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: undefined
    },
    quote: {
      type: String,
      default: undefined
    },
    implementationDeadline: {
      type: Number,
      default: 1
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      default: undefined
    },
    status: {
      type: String,
      enum: Object.values(config.PROGRESS_STATUS)
    },
    stacks: {
      type: [
        {
          category: {
            type: String,
            enum: Object.keys(stacks),
            required: true
          },
          name: {
            type: String,
            enum: stacks[this.category],
            required: true
          },
          description: {
            type: String,
            default: undefined
          }
        }
      ],
      default: []
    },
    dailyRate: {
      type: String,
      default: undefined
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    delay: {
      type: Number,
      default: 0
    },
    tasks: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Task'
        }
      ],
      default: []
    },
    sprints: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Sprint'
        }
      ],
      default: []
    },
    repositories: {
      type: [
        {
          url: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          },
          token: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    },
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

module.exports = mongoose.model('Project', projectSchema);
