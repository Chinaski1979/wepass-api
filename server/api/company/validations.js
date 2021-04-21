import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

export function companyValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = Joi.object().keys({
        name        : Joi.string().required(),
        label       : Joi.string(),
        phoneNumber : Joi.string(),
        country     : Joi.string(),
        province    : Joi.string(),
        address     : Joi.string(),
        email       : Joi.string(),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
