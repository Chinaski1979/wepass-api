import mongoose from 'mongoose';

const propertysSchema = new mongoose.Schema({
  name        : String,
  label       : String,
  address     : String,
  city        : String,
  province    : String,
  country     : { type : String, default : 'CR' },
  coordinates : { type : String, lowercase : true, trim : true },
  image       : String,
  moduleCount : { type : Number, default : 0 },
  admins      : [{type : mongoose.Schema.Types.ObjectId, ref : 'user'}],
  company     : {type : mongoose.Schema.Types.ObjectId, ref : 'company'},
});

export default mongoose.model('property', propertysSchema);
