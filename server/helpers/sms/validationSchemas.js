import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';

const baseSms = Joi.object().keys({
  to   : Joi.string().required(),
  from : Joi.string().required(),
  body : Joi.string().optional(),
});

export function smsData (data) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await executeValidation(data, baseSms);
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
}
