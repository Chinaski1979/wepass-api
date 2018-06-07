// Validations
import { propertyValidation } from './validations';

// Models
import PropertyModel from './propertyModel';

export default class PropertyActions {
  /**
   * @api {post} /property/create Create a property
   * @apiName create
   * @apiGroup property
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} name
   * @apiParam {String} label
   * @apiParam {String} address
   * @apiParam {String} city
   * @apiParam {String} province
   * @apiParam {String} country
   * @apiParam {Object} coordinates - {lat: "9.9439182", long: "-84.0431748"}
   * @apiParam {String} company - Mongo _id
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id"         : "5abc15530b0df40032fdd928",
       "name"        : "Residencial X",
       "label"       : "Some string",
       "address"     : "Sabanilla, San Pedro, San José",
       "city"        : "San Pedro"
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
      res.badRequest(err.message, null, 'Error creating new company');
    }
  }

  /**
   * @api {post} /property/addAdmin Add an admin to a property
   * @apiName addAdmin
   * @apiGroup property
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} propertyId - Mongo _id
   * @apiParam {String} adminId - Mongo _id
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
        "updated": true
     }
  */
  async addAdmin (req, res) {
    try {
      const { propertyId, adminId } = req.body;
      await PropertyModel.update({ _id : propertyId }, { $push : { admins : adminId }});
      res.ok(null, { updated : true }, 'Added new admin successfully.');
    } catch (err) {
      res.badRequest(err.message, null, 'Error adding new admin.');
    }
  }

  /**
   * @api {post} /property/adminProperties Retrieves all admin properties
   * @apiName adminProperties
   * @apiGroup property
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} adminId - Mongo user _id
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     [{
        "_id"         : "5abc15530b0df40032fdd928",
         "name"        : "Residencial X",
         "label"       : "Some string",
         "address"     : "Sabanilla, San Pedro, San José",
         "city"        : "San Pedro"
         "province"    : "San José",
         "country"     : "CR",
         "coordinates" : {"lat": "9.9439182", "long": "-84.0431748"},
         "company"     : "5add15530b0df40032fd3hfld"
     }]
  */
  async adminProperties (req, res) {
    try {
      const { adminId } = req.body;
      const properties = await PropertyModel.find({ admins : adminId });
      res.ok(null, properties, 'Admin properties retrieved successfully!');
    } catch (err) {
      res.badRequest(err.message, null, 'Error retrieving admin properties.');
    }
  }
}
