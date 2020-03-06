const Joi = require('@hapi/joi');

const basic = {
  corporateName: Joi.string().required(),
  contact: Joi.object({
    lastName: Joi.string().required(),
    firstName: Joi.string().required(),
    phone: Joi.string(),
    email: Joi.string().email()
  })
    .required()
    .or('email', 'phone'),
  address: Joi.object({
    street: Joi.string()
      .optional()
      .allow(''),
    zipcode: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    additionalInformation: Joi.string()
      .optional()
      .allow('')
  }).optional(),
  projects: Joi.array()
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
