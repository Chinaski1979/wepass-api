import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  company        : {type : mongoose.Schema.Types.ObjectId, ref : 'company'},
  parentProperty : {type : mongoose.Schema.Types.ObjectId, ref : 'property'},
  name           : String,
  identifier     : { type : String, unique : true, trim : true },
});
export default mongoose.model('module', moduleSchema);
