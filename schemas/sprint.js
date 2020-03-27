const Joi = require('@hapi/joi');
const config = require('./../config/default');

const basic = {
  title: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(config.PROGRESS_STATUS))
    .required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  project: Joi.string().required(),
  tasks: Joi.array()
    .items(Joi.string())
    .optional()
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
