import _ from 'lodash';

// Validations
import { codeValidation } from './validations';

// Services
import { updateAccessCode, setUpAccessHistoryQuery, setResolutionCode } from './services'; // matchesParentProperties

// Helpers
import { getCurrentTime } from 'helpers/timeZone';

// Models
import AccessModel from './accessModel';
import UserModel from '../auth/userModel';
import UnitModel from '../units/unitModel';

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
      codeDetailsValidated.createdAt = getCurrentTime();
      const unit = await UnitModel.findOne({ _id : codeDetailsValidated.unit }).select('parentProperty');
      codeDetailsValidated.parentProperty = unit.parentProperty;
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
       "resolutionCode": 2,
       "missingDetails": ['firstName'],
     }
  */
  async verify (req, res) {
    try {
      const accessQuery = {accessCode : req.body.accessCode};
      const accessCode = await AccessModel.findOne(accessQuery).populate('unit visitor createdBy');
      if (_.isNull(accessCode)) throw Error('Code doesn\'t exist');

      // Verify if agent is from the same parent propery as code being verified
      const agent = await UserModel.findOne({ _id : req.user.userId });
      // await matchesParentProperties(accessCode, agent);

      // Update access code verification info and save changes
      updateAccessCode(accessCode, agent);
      await accessCode.save();

      // Assign a resolution code: 1 = success, 2 = missing information, 3 = expired
      const {resolutionCode, missingDetails} = setResolutionCode(accessCode);

      res.ok(null, {resolutionCode, missingDetails, accessCode}, 'Verified access code successfully');
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
   * @apiParam {string} fromDate - Date for query in format YYYY-MM-DD
   * @apiParam {string} toDate - YYYY-MM-DD
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
  async history (req, res) {
    try {
      const { parentProperty, fromDate, toDate } = req.body;
      const query = setUpAccessHistoryQuery(parentProperty, fromDate, toDate);
      const accessCodes = await AccessModel.find(query).populate('unit visitor createdBy verifiedBy').select('-verified');
      res.ok(null, accessCodes, 'Retrieved access codes successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error retrieving access codes');
    }
  }

  /**
   * @api {put} /access/update/:codeId Add visitor missing details
   * @apiName update
   * @apiGroup access
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} firstName - Visitor Name
   * @apiParam {string} lastName - Visitor last name
   * @apiParam {string} documentID - Visitor ID
   * @apiParam {string} email - Visitor email
   * @apiParam {string} vehiclePlate - Visitor vehicle plate
   * @apiParam {string} phoneNumber - Visitor phone number
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id": "fu77dj5530b0df40032fdd928",
       "unit": "5abc15530b0df4fu7dfdfjr78",
       "visitor": {
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
       },
       "createdBy": "fh5715530b0df4kkd2fdd9d8",
       "accessCode": 381938,
       "verified": false
     }
  */
  async update (req, res) {
    try {
      const accessCode = await AccessModel.findOne({_id : req.params.codeId});
      const updatedUser = await UserModel.findOneAndUpdate({_id : accessCode.visitor}, req.body, { new : true });
      res.ok(null, Object.assign(accessCode, { visitor : updatedUser }), 'Updated access code successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error updating access code');
    }
  }
}
