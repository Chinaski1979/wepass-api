import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

export function incidentValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      if (obj.company) obj.company.toString();
      const schema = Joi.object().keys({
        title       : Joi.string().required(),
        description : Joi.string().required(),
        property    : Joi.string().required(),
        ocuppant    : Joi.string(),
        module      : Joi.string(),
        unit        : Joi.string(),
        attachment  : Joi.string(),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
