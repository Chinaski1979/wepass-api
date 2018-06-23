import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';
import { passcodeTemplate } from './templates';

const baseEmail = Joi.object().keys({
  from    : Joi.string().required(),
  to      : Joi.string().required(),
  subject : Joi.string().required(),
});

const passcode = baseEmail.keys({
  passcode : Joi.string().required(),
});

const schemas = (type) => {
  return {
    passcode,
  }[type];
};

const templates = (type, data) => {
  return {
    passcode : passcodeTemplate(data),
  }[type];
};

export function emailData (type, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await executeValidation(data, schemas(type));
      resolve({ result, template : templates(type, data) });
    } catch (err) {
      reject(err);
    }
  });
}
