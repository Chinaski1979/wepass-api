// Validations
import { propertyValidation } from './validations';

// Models
import PropertyModel from './propertyModel';

export default class PropertyActions {
  /**
   * @api {post} /create Create a property
   * @apiName create
   * @apiGroup property
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} name
   * @apiParam {String} label [optional]
   * @apiParam {String} phoneNumber [optional]
   * @apiParam {String} address [optional]
   * @apiParam {String} country [optional]
   * @apiParam {String} email [optional]
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id"         : "5abc15530b0df40032fdd928",
       "name"        : "Residencial X",
       "label"       : "Some string",
       "address"     : "Sabanilla, San Pedro, San José",
       "province"    : "San José",
       "country"     : "CR",
       "coordinates" : {"lat": "9.9439182", "long": "-84.0431748"},
       "company"     : "5add15530b0df40032fd3hfld"
     }
  */
  async create (req, res) {
    try {
      const propertyValidated = await propertyValidation(req.body);
      const newCompany = await PropertyModel.create(propertyValidated);
      res.created(null, newCompany, 'Created new company successfully');
    } catch (err) {
      res.badRequest(err, null, 'Error creating new company');
    }
  }
}
