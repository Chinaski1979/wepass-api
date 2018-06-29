// Services
import { createNewCompany } from './services';

// Validations
import { companyValidation } from './validations';

// Models
import UserModel from '../auth/userModel';
import CompanyModel from './companyModel';
import PropertyModel from '../property/propertyModel';

export default class CompanyActions {
  /**
   * @api {post} /company/create Create a company
   * @apiName create
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
      res.badRequest(err.message, null, 'Error creating new company');
    }
  }

  /**
   * @api {put} /company/update/:companyId Update company
   * @apiName update
   * @apiGroup company
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} name
   * @apiParam {String} label
   * @apiParam {String} phoneNumber
   * @apiParam {String} country
   * @apiParam {String} province
   * @apiParam {String} address
   * @apiParam {String} email
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       "_id"         : "5abc15530b0df40032fdd928",
       "name"        : "Residencial X",
       "company"     : "5add15530b0df40032fd3hfld"
       "phoneNumber" :  "39id15530b3fdf0032fd34f5t",
       "country"     : "CR",
       "province"    : "San Jose",
       "address"     : "San Pedro"
       "email"       : "residnecialX@email.com"
     }
  */
  async update (req, res) {
    try {
      const newCompanyDetailsValidated = await companyValidation(req.body);
      const query = {_id : req.params.companyId};
      const updatedCompany = await CompanyModel.findOneAndUpdate(query, newCompanyDetailsValidated, { new : true });
      res.ok(null, updatedCompany, 'Company updated successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error updating company');
    }
  }

  /**
   * @api {post} /company/addAdmin Add admin to a company
   * @apiName addAdmin
   * @apiGroup company
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} userId - Mongo _id
   * @apiParam {String} companyId - Mongo _id
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
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
      res.badRequest(err.message, null, 'Error adding admin to company');
    }
  }

  /**
   * @api {post} /company/:companyId Get a company by id
   * @apiName getById
   * @apiGroup company
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
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
      res.badRequest(err.message, null, 'Error retrieving company');
    }
  }

  /**
   * @api {post} company/:companyId/properties Get all properties of a company
   * @apiName getProperties
   * @apiGroup company
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     [{
       "_id"         : "5abc15530b0df40032fdd928",
       "name"        : "Residencial X",
       "label"       : "Some string",
       "address"     : "Sabanilla, San Pedro, San José",
       "province"    : "San José",
       "country"     : "CR",
       "coordinates" : {"lat": "9.9439182", "long": "-84.0431748"},
       "company"     : "5add15530b0df40032fd3hfld"
     }]
  */
  async getProperties (req, res) {
    try {
      const properties = await PropertyModel.find({ company : req.params.companyId });
      res.ok(null, properties, 'Properties retrieved successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error retrieving company');
    }
  }

  /**
   * @api {delete} company/:companyId Delete a company
   * @apiName deleteById
   * @apiGroup company
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
      "removed" : true
     }
  */
  async deleteById (req, res) {
    try {
      await CompanyModel.deleteOne({ _id : req.params.companyId });
      res.ok(null, { removed : true }, 'Property deleted successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error deleting company');
    }
  }
}
