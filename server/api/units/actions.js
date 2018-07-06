// Services
import { updateUnitCount } from '../property/services';
import { deleteManyUsers } from '../user/services';

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
      await updateUnitCount(unitValidated.parentProperty);
      res.created(null, newUnit, 'Created new unit successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new unit');
    }
  }

  /**
   * @api {put} /units/update/:unitId Update a unit
   * @apiName update
   * @apiGroup units
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} company - Company who owns the unit  mongo _id. Avoid updating this value
   * @apiParam {string} parentProperty - Parent property mongo _id. Avoid updating this value
   * @apiParam {string} parentModule - Parent module mongo _id. Avoid updating this value
   * @apiParam {string} identifier - Code or some sort of unique identifier
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       "_id": "5abc15530b0df40032fdd928",
       "company": "66bc15530fjhg60032gfd666",
       "parentProperty": "22bc15530fj4i40032gfd956",
       "parentModule": "aa1c1553zzd4i40032gfd767",
       "identifier": "1"
     }
  */
  async update (req, res) {
    try {
      const newUnitDetailsValidated = await unitValidation(req.body);
      const query = {_id : req.params.unitId};
      const updatedUnit = await UnitModel.findOneAndUpdate(query, newUnitDetailsValidated, { new : true });
      res.ok(null, updatedUnit, 'Unit updated successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error updating unit');
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
      const moduleUnits = await UnitModel.find({ parentModule : req.params.moduleId }).populate('occupants');
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

  /**
   * @api {delete} unit/:propertyId Delete a unit
   * @apiName deleteById
   * @apiGroup units
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
      await UnitModel.deleteOne({ _id : req.params.unitId });
      res.ok(null, { removed : true }, 'Unit deleted successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error deleting unit');
    }
  }

  /**
   * @api {put} unit/empty/:unitId Remove all occupants
   * @apiName empty
   * @apiGroup units
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
      "emptied" : true
     }
  */
  async empty (req, res) {
    try {
      const unit = await UnitModel.findOne({ _id : req.params.unitId });
      await deleteManyUsers(unit.occupants);
      unit.occupants = [];
      await unit.save();
      res.ok(null, { emptied : true }, 'Unit emptied successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error emptying unit');
    }
  }
}
