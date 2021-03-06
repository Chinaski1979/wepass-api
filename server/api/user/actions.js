import _ from 'lodash';

// Services
import { userValidation } from '../auth/validations';
import { sendResetLink } from './services';

// Helpers
import { verifyToken } from 'helpers/tokens';

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


  /**
   * @api {delete} /user/:userId
   * @apiName delete
   * @apiGroup user
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
      "deleted": true
     }
  */
  async delete (req, res) {
    try {
      const { userId } = req.params;
      // Delete reference of user in Unit Schema
      await UnitModel.update({ occupants : userId }, { $pull : { occupants : userId } });
      // Finally delete user
      await UserModel.deleteOne({_id : req.params.userId});
      res.ok(null, {deleted : true}, 'Deleted user successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error deleting user');
    }
  }

  /**
   * @api {put} /user/:userId Update user
   * @apiName update
   * @apiGroup user
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     [{
       firstName    : "David",
       lastName     : "Bowie",
       documentID   : "112880431",
       email        : "bowie@gmail.com",
       vehiclePlate : "FCK-666",
       phoneNumber  : "70759009",
       role         : "Admin",
       company      : "5aebea94092fc5000d9c047a",
       property     : "4jfibea9409fkjd5000d9crj94f",
       profilePic   : "String",
       gender       : "Male",
     }]
  */
  async update (req, res) {
    try {
      const userDetailsValidatated = await userValidation(req.body);
      const query = {_id : req.params.propertyId};
      const updatedUser = await UserModel.findOneAndUpdate(query, userDetailsValidatated, { new : true });
      res.ok(null, updatedUser, 'User updated successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error updating user');
    }
  }

  /**
   * @api {post} /user/sendResetPasswordEmail/:email Reser user password
   * @apiName sendResetPasswordEmail
   * @apiGroup user
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       emailSent : true
     }
  */
  async sendResetPasswordEmail (req, res) {
    try {
      const user = await UserModel.findOne({email : req.params.email}).select('email firstName, role').lean();
      if (_.isNull(user)) {
        throw Error('Email not found');
      }
      await sendResetLink(user);
      res.ok(null, {emailSent : true}, 'Email for reseting password sent successfully');
    } catch (err) {
      console.log('err', err);
      res.badRequest(err.message, null, 'Error sending email for password reset');
    }
  }

  async resetPasswordForm (req, res) {
    try {
      const { token } = req.params;
      const tokenDecoded = await verifyToken(token);
      const user = await UserModel.findById(tokenDecoded.content.userId).select('firstName');
      if (!user) {
        throw Error('The user does not exist.');
      }
      res.render('pages/password', { user, token });
    } catch (error) {
      res.render('pages/password', { error });
    }
  }

  async changePassword (req, res) {
    try {
      const { token } = req.params;
      const tokenDecoded = await verifyToken(token);
      const user = await UserModel.findOne({_id : tokenDecoded.content.userId});
      user.password = req.body.password;
      user.save();
      if (!user) {
        throw new Error('The user does not exist.');
      }
      res.ok(null, {passwordUpdated : true}, 'Password resetted successfully.');
    } catch (err) {
      res.badRequest(err.message, null, 'Error resetting password.');
    }
  }
}
