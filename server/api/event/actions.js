// Validations
import { eventValidation, updateEventValidation } from './validations';

// Models
import EventModel from './eventModel';

export default class EventActions {
  async create (req, res) {
    try {
      const eventValidated = await eventValidation(req.body);
      const newEvent = await EventModel.create(eventValidated);
      res.created(null, newEvent, 'Created new event successfully');
    } catch (err) {
      res.badRequest(err.message, null, 'Error creating new Event');
    }
  }

  async update (req, res) {
    try {
      const eventValidated = await updateEventValidation(req.body);
      const updatedEvent = await EventModel.findOneAndUpdate({ _id : eventValidated.eventId}, eventValidated);
      res.created(null, updatedEvent, `The Event ${updatedEvent._id} was update successfully`);
    } catch (err) {
      res.badRequest(err.message, null, `Error updating ${req.body._id}`);
    }
  }

  async adminEvent (req, res) {
    try {
      const { adminId } = req.body;
      const events = await EventModel.find({ owner : adminId })
        .populate('owner', 'firstName')
        .populate('user', 'firstName')
        .populate('property', 'name')
        .populate('module', 'name')
        .populate('unit', 'identifier');

      res.ok(null, events, 'Admin events retrieved successfully!');
    } catch (err) {
      res.badRequest(err.message, null, 'Error retrieving admin events.');
    }
  }
}
