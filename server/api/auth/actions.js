import _ from 'lodash';

// Helpers
import { TOKENS_TIME } from 'helpers/constants';
import { generateToken, verifyToken } from 'helpers/tokens';

// Models
import UserModel from './userModel';

export default class AuthActions {
  /**
   * @api {post} /login User log in
   * @apiName login
   * @apiGroup auth
   * @apiVersion 1.0.0
   *
   * @apiUse applicationError
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
        token   : generateToken({ userId : user._id }, TOKENS_TIME.AUTH),
        refresh : generateToken({ userId : user._id, type : 'refresh' }, TOKENS_TIME.REFRESH),
      };
      res.ok(null, Object.assign(tokens, { user : _.omit(user, ['password']) }), 'Log in successful.');
    } catch (err) {
      res.badRequest(err, null, 'Error logging in.');
    }
  }

  /**
   * @api {post} /refreshToken Refresh tokens
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
      res.badRequest(err, null, 'Error refreshing tokens');
    }
  }
}
