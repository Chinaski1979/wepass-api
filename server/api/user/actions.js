import _ from 'lodash';

// Models
import UserModel from '../auth/userModel';
import UnitModel from '../units/unitModel';

export default class UserActions {
  /**
   * @api {post} /user/search/:vehiclePlate Search user by plate
   * @apiName searchUser
   * @apiGroup user
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     [{
       _id          : "5abc15530b0df40032fdd928",
       firstName    : "David",
       lastName     : "Bowie",
       documentID   : "112880431",
       email        : "bowie@gmail.com",
       vehiclePlate : "FCK-666",
       phoneNumber  : "70759009",
       role         : "Admin",
       company      : "5aebea94092fc5000d9c047a",
       unit         : "566bxa94065fcwe10d2c90fh",
       profilePic   : "String",
       gender       : "Male",
     }]
  */
  async searchUser (req, res) {
    try {
      const user = await UserModel.find({ vehiclePlate : req.params.vehiclePlate}).select('-password').lean();
      res.ok(null, user, 'Found user successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error finding user');
    }
  }

  /**
   * @api {post} /user/searchByQuery?email=peterson@email.com Search user by query
   * @apiName searchUser
   * @apiGroup user
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       _id          : "5abc15530b0df40032fdd928",
       firstName    : "David",
       lastName     : "Bowie",
       documentID   : "112880431",
       email        : "bowie@gmail.com",
       vehiclePlate : "FCK-666",
       phoneNumber  : "70759009",
       role         : "Admin",
       company      : "5aebea94092fc5000d9c047a",
       unit         : "566bxa94065fcwe10d2c90fh",
       profilePic   : "String",
       gender       : "Male",
     }
  */
  async searchByQuery (req, res) {
    try {
      const user = await UserModel.find(req.query).select('-password').lean();
      res.ok(null, user, 'Found user successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error finding user');
    }
  }

  /**
   * @api {get} /user/searchByParentPremise?parentProperty=5b03c19fcc89680009fa32aa&role=user Search user by _id parentPremise
   * @apiName searchByParentPremise
   * @apiGroup user
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} company - Query String Company _id
   * @apiParam {String} parentProperty - Query String Propery _id
   * @apiParam {String} parentModule - Query String Model _id
   * @apiParam {String} _id - Query String Unit _id
   * @apiParam {String} role - One of user', 'guest', 'agent', 'admin', 'superAdmin
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     [{
       _id          : "5abc15530b0df40032fdd928",
       firstName    : "David",
       lastName     : "Bowie",
       documentID   : "112880431",
       email        : "bowie@gmail.com",
       vehiclePlate : "FCK-666",
       phoneNumber  : "70759009",
       role         : "Admin",
       company      : "5aebea94092fc5000d9c047a",
       unit         : "566bxa94065fcwe10d2c90fh",
       profilePic   : "String",
       gender       : "Male",
     }]
  */
  async searchByParentPremise (req, res) {
    try {
      const query = _.omit(req.query, ['role']);
      const result = await UnitModel.find(query)
        .select('ocupants -_id')
        .populate('occupants').lean();
      const usersFromAllDocs = _.flatMap(result, 'occupants');
      res.ok(null, _.filter(usersFromAllDocs, { role : req.query.role }), 'Found users successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error finding users');
    }
  }
}
