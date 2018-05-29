// Services
import { createNewCompany } from './services';

// Models
import UserModel from '../auth/userModel';
import CompanyModel from './companyModel';

export default class CompanyActions {
  /**
   * @api {post} /create Create a company
   * @apiName createCompany
   * @apiGroup company
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
  async create (req, res) {
    try {
      const newCompany = await createNewCompany(req.body);
      res.created(null, newCompany, 'Created new company successfully');
    } catch (err) {
      res.badRequest(err, null, 'Error creating new company');
    }
  }

  /**
   * @api {post} /addAdmin Add admin to a company
   * @apiName addAdmin
   * @apiGroup company
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} userId
   * @apiParam {String} companyId
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
        "newCompanyAdded": true
     }
  */
  async addAdmin (req, res) {
    try {
      const { userId, companyId } = req.body;
      const user = await UserModel.findOne({ _id : userId });
      if (user.role === 'admin' || user.role === 'superAdmin') {
        if (user.company) {
          res.badRequest({message : 'User has a company already.' }, null, 'Error adding company to Admin');
        } else {
          user.company = companyId;
          await user.save();
          res.ok(null, user, 'Added new admin to company successfully');
        }
      } else {
        res.badRequest({ message : 'User is not an admin.'}, null, 'Error adding company to Admin');
      }
    } catch (err) {
      res.badRequest(err, null, 'Error adding admin to company');
    }
  }

  /**
   * @api {post} /:companyId Get a company by id
   * @apiName getById
   * @apiGroup company
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} companyId
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
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
  async getById (req, res) {
    try {
      const { companyId } = req.params;
      const company = await CompanyModel.findOne({ _id : companyId });
      res.ok(null, company, 'Retrieved company successfully');
    } catch (err) {
      res.badRequest(err, null, 'Error retrieving company');
    }
  }
}
