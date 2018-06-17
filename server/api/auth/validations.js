import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

export function userValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      obj.company = obj.company.toString();
      const schema = Joi.object().keys({
        firstName    : Joi.string(),
        lastName     : Joi.string(),
        documentID   : Joi.string(),
        email        : Joi.string(),
        vehiclePlate : Joi.string(),
        phoneNumber  : Joi.string(),
        password     : Joi.string(),
        role         : Joi.string(),
        profilePic   : Joi.string(),
        gender       : Joi.string(),
        trial        : Joi.boolean(),
        company      : Joi.string(),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
