import mongoose from 'mongoose';

const incidentsSchema = new mongoose.Schema({
  title       : String,
  description : String,
  date        : { type : Date, default : new Date() },
  createdBy   : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  ocuppant    : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  property    : {type : mongoose.Schema.Types.ObjectId, ref : 'property'},
  module      : {type : mongoose.Schema.Types.ObjectId, ref : 'module'},
  unit        : {type : mongoose.Schema.Types.ObjectId, ref : 'unit'},
  attachment  : String, // S3 URL
});

export default mongoose.model('incidents', incidentsSchema);
