const Joi = require('@hapi/joi');

export const userValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(3).required()
})