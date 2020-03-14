const Joi = require('@hapi/joi');
const config = require('./../config/default');

const basic = {
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(config.PROGRESS_STATUS))
    .required(),
  startDate: Joi.string().optional(),
  endDate: Joi.string().optional(),
  completionTime: Joi.string().optional(),
  project: Joi.string().required(),
  sprint: Joi.string().optional()
};

const creationSchema = Joi.object(basic);

const updateSchema = Joi.object({
  _id: Joi.string().required(),
  ...basic
});

module.exports = {
  creationSchema,
  updateSchema
};
