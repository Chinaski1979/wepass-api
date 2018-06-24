import mongoose from 'mongoose';

const accessSchema = new mongoose.Schema({
  unit       : {type : mongoose.Schema.Types.ObjectId, ref : 'unit'},
  visitor    : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  createdBy  : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  accessCode : Number,
  verified   : { type : Boolean, default : false },
  verifiedBy : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  verifiedAt : Date,
  createdAt  : Date,
});
export default mongoose.model('access', accessSchema);
