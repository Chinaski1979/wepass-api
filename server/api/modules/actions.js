// Validations
import { moduleValidation } from './validations';

// Models
import ModuleModel from './moduleModel';

export default class ModulesActions {
  /**
   * @api {post} /modules/create Create a module
   * @apiName create
   * @apiGroup modules
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} company - Company _id that owns the unit
   * @apiParam {string} parentProperty - Propery _id in which module is located
   * @apiParam {string} name - Name of module
   * @apiParam {string} identifier - Code or some sort of unique identifier
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id": "5abc15530b0df40032fdd928",
       "company": "66bc15530fjhg60032gfd666",
       "parentProperty": "22bc15530fj4i40032gfd956",
       "name": "Name of module",
       "identifier": "1A"
     }
  */
  async create (req, res) {
    try {
      const moduleValidated = await moduleValidation(req.body);
      const newModule = await ModuleModel.create(moduleValidated);
      res.created(null, newModule, 'Created new module successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new module');
    }
  }

  /**
   * @api {get} /modules/byProperty Create a module
   * @apiName byProperty
   * @apiGroup modules
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 OK
     {
       "_id": "5abc15530b0df40032fdd928",
       "company": "66bc15530fjhg60032gfd666",
       "parentProperty": "22bc15530fj4i40032gfd956",
       "name": "Name of module",
       "identifier": "1A"
     }
  */
  async byProperty (req, res) {
    try {
      const propertyModules = await ModuleModel.find({ parentProperty : req.params.propertyId });
      res.ok(null, propertyModules, 'Retrieved property modules successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error retrieving property modules');
    }
  }
}
