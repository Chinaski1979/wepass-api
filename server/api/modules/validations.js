import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

export function moduleValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = Joi.object().keys({
        company        : Joi.string(),
        parentProperty : Joi.string(),
        name           : Joi.string(),
        identifier     : Joi.string(),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
