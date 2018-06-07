// Validations
import { unitValidation } from './validations';

// Models
import UnitModel from './unitModel';

export default class UnitsActions {
  /**
   * @api {post} /units/create Create a new unit
   * @apiName create
   * @apiGroup units
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} company - Company who owns the unit  mongo _id
   * @apiParam {string} parentProperty - Parent property mongo _id
   * @apiParam {string} parentModule - Parent module mongo _id
   * @apiParam {string} identifier - Code or some sort of unique identifier
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id": "5abc15530b0df40032fdd928",
       "company": "66bc15530fjhg60032gfd666",
       "parentProperty": "22bc15530fj4i40032gfd956",
       "parentModule": "aa1c1553zzd4i40032gfd767",
       "identifier": "1"
     }
  */
  async create (req, res) {
    try {
      const unitValidated = await unitValidation(req.body);
      const newUnit = await UnitModel.create(unitValidated);
      res.created(null, newUnit, 'Created new unit successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new unit');
    }
  }

  /**
   * @api {get} /units/byParentModule/:moduleId Get property modules
   * @apiName byParentModule
   * @apiGroup units
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       "_id": "5abc15530b0df40032fdd928",
       "company": "66bc15530fjhg60032gfd666",
       "parentProperty": "22bc15530fj4i40032gfd956",
       "parentModule": "aa1c1553zzd4i40032gfd767",
       "identifier": "1",
       "ocupants": ["asac1553fhdjeyi40032gfd999"]
     }
  */
  async byParentModule (req, res) {
    try {
      const moduleUnits = await UnitModel.find({ parentModule : req.params.moduleId });
      res.ok(null, moduleUnits, 'Successfully retrieved module units');
    } catch (err) {
      res.badRequest(err.message, null, 'Error retrieving module units');
    }
  }

  /**
   * @api {post} /units/addOcupant Add occupant
   * @apiName addOcupant
   * @apiGroup units
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} unitId - Unit mongo _id
   * @apiParam {string} userId - New occupant (user) mongo _id
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
      "updated": true
     }
  */
  async addOcupant (req, res) {
    try {
      const { unitId, userId } = req.body;
      await UnitModel.findOneAndUpdate({ _id : unitId }, { $push : { occupants : userId }});
      res.ok(null, { updated : true }, 'New ocupant added');
    } catch (err) {
      res.badRequest(err.message, null, 'Error adding new ocupant');
    }
  }
}
