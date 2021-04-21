import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

export function unitValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = Joi.object().keys({
        company        : Joi.string(),
        parentProperty : Joi.string(),
        parentModule   : Joi.string(),
        identifier     : Joi.string(),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
