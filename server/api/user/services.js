// Helpers
import { generateToken } from 'helpers/tokens';
import buildEmailTemplate from 'helpers/email';

// Models
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

export function sendResetLink (user) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = generateToken({ userId : user._id, role : user.role }, '1d');
      await buildEmailTemplate({
        from    : process.env.MG_FROM_EMAIL,
        to      : user.email,
        subject : 'Tú link para resetar el password',
        title   : 'Resetear Password',
        content : 'Clickea el siguiente link para poder crear un nuevo password.',
        footer  : `<a href="${process.env.SERVER_BASE_URL}/user/resetPasswordForm/${token}">Crear un nuevo password</a>`,
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
