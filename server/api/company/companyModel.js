import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name        : String,
  label       : String,
  phoneNumber : String,
  address     : String,
  province    : String,
  country     : { type : String, default : 'CR' },
  email       : { type : String, lowercase : true, trim : true },
});

export default mongoose.model('company', companySchema);
