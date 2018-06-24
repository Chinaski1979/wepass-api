import _ from 'lodash';
import moment from 'moment';

// Validations
import { codeValidation } from './validations';

// Services
import { updateAccessCode } from './services'; // matchesParentProperties

// Models
import AccessModel from './accessModel';
import UserModel from '../auth/userModel';

export default class AccessActions {
  /**
   * @api {post} /access/create Create new access code
   * @apiName create
   * @apiGroup access
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} visitor - Mongo _id of visitor (user)
   * @apiParam {string} unit - Mongo _id of unit
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id": "fu77dj5530b0df40032fdd928",
       "unit": "5abc15530b0df4fu7dfdfjr78",
       "visitor": "fjdh15530b0hdhfy032fddfh34f",
       "createdBy": "fh5715530b0df4kkd2fdd9d8",
       "accessCode": 381938,
       "verified": false
     }
  */
  async create (req, res) {
    try {
      const codeDetailsValidated = await codeValidation(req.body);
      codeDetailsValidated.createdBy = req.user.userId;
      codeDetailsValidated.accessCode = Math.floor(10000 + Math.random() * 9000);
      codeDetailsValidated.createdAt = moment().utc().subtract(6, 'hours');
      const accessCode = await AccessModel.create(codeDetailsValidated);
      res.created(null, accessCode, 'Created new access code successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new access code');
    }
  }

  /**
   * @api {post} /access/verify Verify access code
   * @apiName verify
   * @apiGroup access
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {number} accessCode - Access code
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     {
       "_id": "fu77dj5530b0df40032fdd928",
       "unit": {type : mongoose.Schema.Types.ObjectId, ref : 'unit'},
       "visitor": {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
       "createdBy": {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
       "accessCode": 40583023,
       "verified": true,
       "verifiedBy": {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
       "verifiedAt": Date,
     }
  */
  async verify (req, res) {
    try {
      const accessQuery = {accessCode : req.body.accessCode};
      const accessCode = await AccessModel.findOne(accessQuery).populate('unit visitor createdBy');
      if (_.isNull(accessCode)) throw new Error('Code doesn\'t exist');

      // Verify if agent is from the same parent propery as code being verified
      const agent = await UserModel.findOne({ _id : req.user.userId });
      // await matchesParentProperties(accessCode, agent);

      // Update access code verification info and save changes
      updateAccessCode(accessCode, agent);
      await accessCode.save();

      res.ok(null, accessCode, 'Verified access code successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error verifying access code');
    }
  }

  /**
   * @api {get} /access/history Get access code history
   * @apiName history
   * @apiGroup access
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} parentProperty - Mongo _id of parent property
   * @apiParam {string} fromDate - Date for query in format mm/dd/yyyy | I think front should sent date in UTC
   * @apiParam {string} toDate
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     [{
       "_id": "fu77dj5530b0df40032fdd928",
       "unit": {type : mongoose.Schema.Types.ObjectId, ref : 'unit'},
       "visitor": {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
       "createdBy": {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
       "accessCode": 40583023,
       "verified": true,
       "verifiedBy": {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
       "verifiedAt": Date,
     }]
  */
  // async history (req, res) {
  //   try {
  //     const { parentProperty, fromDate, toDate } = req.body;
  //     const startDate = new Date(date);  // Beggining of day.
  //     startDate.setHours(0);
  //     startDate.setMinutes(0);
  //     startDate.setSeconds(0);
  //     const query = { verifiedAt : {'$gte' : startDate, '$lt' : endDate}, 'unit.parentProperty': parentProperty };
  //     const accessCodes = await AccessModel.find(query);
  //
  //     res.ok(null, accessCodes, 'Retrieved access codes successfully');
  //   } catch (err) {
  //     res.badRequest(err.message, null, 'Error retrieving access codes');
  //   }
  // }
}
