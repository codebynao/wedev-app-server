const Joi = require('@hapi/joi');
const config = require('./../config/default');

const basic = {
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  company: Joi.string().optional(),
  siret: Joi.string()
    .length(config.LENGTH_SIRET)
    .optional(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(config.MINIMUM_LENGTH_PASSWORD)
    .optional(),
  phone: Joi.string().optional(),
  companyStatus: Joi.string()
    .valid(...Object.values(config.COMPANY_STATUS))
    .optional(),
  professionalStatus: Joi.string()
    .valid(...Object.values(config.PROFESSIONAL_STATUS))
    .optional(),
  isDeactivated: Joi.boolean().default(false),
  clients: Joi.array()
    .items(Joi.string())
    .optional(),
  projects: Joi.array()
    .items(Joi.string())
    .optional(),
  githubToken: Joi.string().optional(),
  githubLogin: Joi.string().optional()
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
