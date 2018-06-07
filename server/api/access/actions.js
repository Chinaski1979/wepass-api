// Validations
import { codeValidation } from './validations';

// Models
import AccessModel from './accessModel';

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
      const accessCode = await AccessModule.create(codeDetailsValidated);
      res.created(null, accessCode, 'Created new access code successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new access code');
    }
  }
}
