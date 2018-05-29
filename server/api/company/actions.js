// Services
import { createNewCompany } from './services';

export default class CompanyActions {
  /**
   * @api {post} /refreshToken Refresh tokens
   * @apiName refreshToken
   * @apiGroup auth
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
       "phoneNumber" : "42449000",
       "address"     : "Sabanilla, San Pedro, San José",
       "province"    : "San José"
       "country"     : "CR",
       "email"       : residencialX@gmail.com
     }
  */
  async createCompany (req, res) {
    try {
      const newCompany = await createNewCompany(req.body);
      res.created(null, newCompany, 'Created new company successfully');
    } catch (err) {
      res.badRequest(err, null, 'Error creating new company');
    }
  }
}
