import Joi from 'joi';

export function executeValidation (obj, schema) {
  return new Promise((resolve, reject) => {
    Joi.validate(obj, schema, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}
