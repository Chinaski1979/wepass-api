import _ from 'lodash';

// Services
import { createUser, sendFirstTimePasscode } from './services';
import { createNewCompany } from '../company/services';

// Helpers
import { TOKENS_TIME } from 'helpers/constants';
import { generateToken, verifyToken } from 'helpers/tokens';

// Validations
import { userValidation } from './validations';

// Models
import UserModel from './userModel';

export default class AuthActions {
  /**
   * @api {post} /auth/login User log in
   * @apiName login
   * @apiGroup auth
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} email [optional]
   * @apiParam {String} phoneNumber [optional]
   * @apiParam {String} password
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YWJjMTU1MzBiMGRmNDAwMz...",
       "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YWJjMTU1MzBiMGRmNDAw...",
       "user": {
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
     }
   */
  async login (req, res) {
    try {
      const { email, phoneNumber, password } = req.body;
      const searchBy = email ? { email } : { phoneNumber };
      const user = await UserModel.findOne(searchBy);
      if (_.isNull(user)) {
        throw new Error('User not found.');
      }
      await user.comparePassword(password);
      const tokens = {
        token   : generateToken({ userId : user._id, role : user.role }, TOKENS_TIME.AUTH),
        refresh : generateToken({ userId : user._id, role : user.role, type : 'refresh' }, TOKENS_TIME.REFRESH),
      };
      res.ok(null, Object.assign(tokens, { user : _.omit(user, ['password']) }), 'Log in successful.');
    } catch (err) {
      res.badRequest(err.message, null, 'Error logging in.');
    }
  }

  /**
   * @api {post} /auth/refreshToken Refresh tokens
   * @apiName refreshToken
   * @apiGroup auth
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {String} token
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YWJjMTU1MzBiMGRmNDAwMz...",
       "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YWJjMTU1MzBiMGRmNDAw..."
     }
  */
  async refreshToken (req, res) {
    try {
      const { token } = req.body;
      const decoded = await verifyToken(token, false);
      if (decoded.content.type !== 'refresh') {
        throw new Error('Not a refresh token');
      }
      const signInfo = _.omit(decoded.content, ['type', 'iat', 'exp']);
      const newTokens = {
        token   : generateToken(signInfo, TOKENS_TIME.AUTH),
        refresh : generateToken(_.assign(signInfo, { type : 'refresh'}), TOKENS_TIME.REFRESH),
      };
      res.ok(null, newTokens, 'Tokens successfully refreshed');
    } catch (err) {
      res.badRequest(err.message, null, 'Error refreshing tokens');
    }
  }

  /**
   * @api {post} /auth/trialRegistration Self trial registration
   * @apiName trialRegistration
   * @apiGroup auth
   * @apiVersion 1.0.0
   *
   * @apiUse applicationError
   *
   * @apiParam {String} firstName
   * @apiParam {String} lastName
   * @apiParam {String} email
   * @apiParam {String} password
   * @apiParam {String} companyName
   *
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id": "5abc15530b0df40032fdd928",
       "firstName": "Jack",
       "lastName": "White",
       "email": "white@gmail.com",
       "role": "Admin",
       "company": "5abc15530b0df40032fdd928",
       "trial": "true"
     }
  */
  async trialRegistration (req, res) {
    try {
      const { companyName, firstName, lastName, email, password } = req.body;
      const newCompany = await createNewCompany({ name : companyName });
      const userDetails = { firstName, lastName, email, password, role : 'admin', trial : true, company : newCompany._id };
      const newUser = await createUser(userDetails);
      // Send notification email

      res.created(null, newUser, 'Created trial account successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating trial account');
    }
  }

  /**
   * @api {post} /auth/createAccount Create a new user account
   * @apiName createAccount
   * @apiGroup auth
   * @apiVersion 1.0.0
   *
   * @apiUse applicationError
   *
   * @apiParam {String} firstName
   * @apiParam {String} lastName
   * @apiParam {String} email
   * @apiParam {String} documentID
   * @apiParam {String} password
   * @apiParam {String} vehiclePlate
   * @apiParam {String} phoneNumber
   * @apiParam {String} email
   * @apiParam {String} role
   * @apiParam {String} gender
   * @apiParam {String} profilePic
   * @apiParam {String} company - Mongo _id of the company
   * @apiParam {String} property - Mongo _id of the company
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id": "5abc15530b0df40032fdd928",
       "firstName": "Jack",
       "lastName": "White",
       "documentID": "112333442"
       "email": "white@gmail.com",
       "vehiclePlate": "AAA-111",
       "phoneNumber": "24329086",
       "role": "Admin",
       "profilePic": "ImageURLstring",
       "gender": "Male",
       "company": "5abc15530b0df40032fdd928",
       "trial": false,
       "property": "914nk2h45209gr0g33ffdfs"
     }
  */

  async createAccount (req, res) {
    try {
      const userValidated = await userValidation(req.body);
      const newAccount = await createUser(userValidated);
      // Send email with first time passcode if account role is 'user'
      if (newAccount.role === 'user') await sendFirstTimePasscode(newAccount);
      res.created(null, newAccount, 'Created account successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating account');
    }
  }
}
