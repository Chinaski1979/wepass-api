import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';
import { genericTemplate } from './templates';

const baseEmail = Joi.object().keys({
  from    : Joi.string().required(),
  to      : Joi.string().required(),
  subject : Joi.string().required(),
  title   : Joi.string().optional(),
  content : Joi.string().optional(),
  footer  : Joi.string().optional(),
});

export function emailData (data) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await executeValidation(data, baseEmail);
      resolve({ result, template : genericTemplate(data) });
    } catch (err) {
      reject(err);
    }
  });
}
