import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

export function codeValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = Joi.object().keys({
        visitor : Joi.string().required(),
        unit    : Joi.string().required(),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
