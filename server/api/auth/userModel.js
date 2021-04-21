import mongoose from 'mongoose';
const bcrypt = require('bcrypt-nodejs');

// Enums
const roleTypes = ['user', 'guest', 'agent', 'admin', 'superAdmin'];
const genderTypes = ['male', 'female'];

const userSchema = new mongoose.Schema({
  firstName         : String,
  lastName          : String,
  documentID        : { type : String },
  email             : { type : String, lowercase : true, trim : true },
  vehiclePlate      : { type : String, trim : true },
  phoneNumber       : { type : String, trim : true },
  password          : String,
  role              : { type : String, required : true, enum : roleTypes },
  company           : { type : mongoose.Schema.Types.ObjectId, ref : 'company' }, // Mainly for agents and admins
  property          : { type : mongoose.Schema.Types.ObjectId, ref : 'property' }, // Mainly for agent
  profilePic        : String,
  gender            : { type : String, enum : genderTypes },
  address           : String,
  trial             : Boolean,
  firstTimeAccessed : { type : Boolean, default : false },
  createdAt         : { type : Date, default : new Date() },
});

userSchema.pre('save', function hashPass (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    next();
  }
  // Generate a salt and apply to a password with the hashed one
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) {
      throw err;
    }
    this.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function comparePassword (userPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(userPassword, this.password, (err, match) => {
      if (err) {
        reject(err);
      }
      resolve(match);
    });
  });
};

export default mongoose.model('user', userSchema);
