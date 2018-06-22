import Joi from 'joi';
import { executeValidation } from 'helpers/joiValidate';
import { eventsWhiteList } from '../../helpers/constants';

export function eventValidation (obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = Joi.object().keys({
        title       : Joi.string().required(),
        description : Joi.string().optional(),
        date        : Joi.date().required(),
        owner       : Joi.string().required(),
        user        : Joi.string().optional(),
        property    : Joi.string().required(),
        module      : Joi.string().optional(),
        unit        : Joi.string().optional(),
        state       : Joi.any().valid(eventsWhiteList).default(eventsWhiteList[0]),
      });
      const result = await executeValidation(obj, schema);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}
