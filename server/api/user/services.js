import UserModel from '../auth/userModel';

export function deleteManyUsers (userIdGroup) {
  return new Promise(async (resolve, reject) => {
    try {
      await UserModel.deleteMany({_id : {$in : userIdGroup}});
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
