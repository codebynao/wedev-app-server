const Joi = require('@hapi/joi');
const stacks = require('./../config/stacks');
const config = require('./../config/default');

const stackSchema = {
  category: Joi.string()
    .valid(...Object.keys(stacks))
    .required(),
  name: Joi.string()
    .when('category', {
      is: 'backend',
      then: Joi.string().valid(...stacks.backend)
    })
    .when('category', {
      is: 'database',
      then: Joi.string().valid(...stacks.database)
    })
    .when('category', {
      is: 'devops',
      then: Joi.string().valid(...stacks.devops)
    })
    .when('category', {
      is: 'frontend',
      then: Joi.string().valid(...stacks.frontend)
    })
    .required(),
  description: Joi.string()
    .optional()
    .allow('')
};

const basic = {
  title: Joi.string().required(),
  quote: Joi.number().optional(),
  implementationDeadline: Joi.number().default(1),
  startDate: Joi.string().required(),
  endDate: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(config.PROGRESS_STATUS))
    .required(),
  stacks: Joi.array()
    .items(stackSchema)
    .required(),
  dailyRate: Joi.number().optional(),
  client: Joi.string().optional(),
  user: Joi.string().required(),
  delay: Joi.number().default(0),
  repositories: Joi.array()
    .items({
      url: Joi.string()
        .uri()
        .required(),
      name: Joi.string().required(),
      token: Joi.string().required()
    })
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
