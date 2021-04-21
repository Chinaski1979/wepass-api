import mongoose from 'mongoose';

const firstTimePasscodeSchema = new mongoose.Schema({
  passcode  : Number,
  user      : { type : mongoose.Schema.Types.ObjectId, ref : 'user', unique : true },
  createdAt : { type : Date, default : new Date() },
});

export default mongoose.model('firstTimePasscode', firstTimePasscodeSchema);
