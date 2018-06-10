// Services
// import { userValidation } from './validations';

// Modules
import UserModel from './userModel';

export function createUser (userDetails) {
  return new Promise(async (resolve, reject) => {
    try {
      // const userDetailsValidated = await userValidation(userDetails);
      const user = await UserModel.create(userDetails);
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
}
