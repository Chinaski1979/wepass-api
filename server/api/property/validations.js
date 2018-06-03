import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

export function propertyValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = Joi.object().keys({
        name        : Joi.string(),
        label       : Joi.string(),
        address     : Joi.string(),
        city        : Joi.string(),
        province    : Joi.string(),
        country     : Joi.string(),
        coordinates : Joi.object(),
        company     : Joi.string(),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
