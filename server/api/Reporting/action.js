// Helpers
import { getCurrentTime } from 'helpers/timeZone';

// Validations
import { incidentValidation } from './validations';

// Models
import IncidentsModel from './models/incidentsModel';

export default class IncidentsActions {
  /**
   * @api {post} /reporting/incidents/create Create new incident
   * @apiName createIncident
   * @apiGroup incidents
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiParam {string} title - Incident title. Required
   * @apiParam {string} description - Incident description. Required
   * @apiParam {string} property - Mongo _id of property. Required
   * @apiParam {string} ocuppant - Mongo _id of ocuppant
   * @apiParam {string} module - Mongo _id of module
   * @apiParam {string} unit - Mongo _id of unit
   * @apiParam {string} attachment - S3 URL
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 201 CREATED
     {
       "_id": "fu77dj5530b0df40032fdd928",
       "title": "Some incident title",
       "description": "Some incident description",
       "date": "Sun Dec 17 1995 03:24:00",
       "createdBy": "fh5715530b0df4kkd2fdd9d8",
       "ocuppant": "f43fds553fdf4f4kkd2fff45",
       "property": "4r4rds553fdf4f4kkd46fndf6",
       "module": "eeerdsff3fdf4f4kkd46fndfd",
       "unit": "eserdsff3f4r4f4kkd46gf88d",
       "attachment": "https://someurl"
     }
  */
  async createIncident (req, res) {
    try {
      const incidentValidated = await incidentValidation(req.body);
      incidentValidated.date = getCurrentTime();
      incidentValidated.createdBy = req.user.userId;
      const newIncident = await IncidentsModel.create(incidentValidated);
      res.created(null, newIncident, 'Created new incident successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new incident');
    }
  }


  /**
   * @api {post} /reporting/incidents/:propertyId Get incidents by Property
   * @apiName incidentsByProperty
   * @apiGroup incidents
   * @apiVersion 1.0.0
   *
   * @apiUse authorizationHeaders
   * @apiUse applicationError
   *
   * @apiSuccessExample {json} Success
     HTTP/1.1 200 OK
     [{
       "_id": "fu77dj5530b0df40032fdd928",
       "title": "Some incident title",
       "description": "Some incident description",
       "date": "Sun Dec 17 1995 03:24:00",
       "createdBy": "fh5715530b0df4kkd2fdd9d8",
       "ocuppant": "f43fds553fdf4f4kkd2fff45",
       "property": "4r4rds553fdf4f4kkd46fndf6",
       "module": "eeerdsff3fdf4f4kkd46fndfd",
       "unit": "eserdsff3f4r4f4kkd46gf88d",
       "attachment": "https://someurl"
     }]
  */
  async incidentsByProperty (req, res) {
    try {
      const incidents = await IncidentsModel.find({ property : req.params.propertyId }).populated('createdBy occupant, unit');
      res.ok(null, incidents, 'Incidents retrieved successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error retrieving incidents');
    }
  }
}
