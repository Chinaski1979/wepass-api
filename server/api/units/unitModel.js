import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  company        : {type : mongoose.Schema.Types.ObjectId, ref : 'company'},
  parentProperty : {type : mongoose.Schema.Types.ObjectId, ref : 'property'},
  parentModule   : {type : mongoose.Schema.Types.ObjectId, ref : 'module'},
  occupants      : {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
  identifier     : String,
});
export default mongoose.model('unit', unitSchema);
