import mongoose from 'mongoose';

const propertysSchema = new mongoose.Schema({
  name        : String,
  label       : String,
  address     : String,
  city        : String,
  province    : String,
  country     : { type : String, default : 'CR' },
  coordinates : {
    lat  : { type : String },
    long : { type : String },
  },
  image       : String,
  moduleCount : { type : Number, default : 0 },
  moduleLabel : String,
  unitCount   : { type : Number, default : 0 },
  unitLabel   : String,
  admins      : [{type : mongoose.Schema.Types.ObjectId, ref : 'user'}],
  company     : {type : mongoose.Schema.Types.ObjectId, ref : 'company'},
});

export default mongoose.model('property', propertysSchema);
