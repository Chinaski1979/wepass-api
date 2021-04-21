import mongoose from 'mongoose';
import { eventsWhiteList } from '../../helpers/constants';

const eventSchema = new mongoose.Schema({
  title       : String,
  description : String,
  date        : { type : Date, default : Date.now },
  owner       : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  user        : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  property    : {type : mongoose.Schema.Types.ObjectId, ref : 'property'},
  module      : {type : mongoose.Schema.Types.ObjectId, ref : 'module'},
  unit        : {type : mongoose.Schema.Types.ObjectId, ref : 'unit'},
  state       : {type : String, enum : eventsWhiteList, default : 'pending' },
});

export default mongoose.model('event', eventSchema);
