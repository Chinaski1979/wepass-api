// Helpers
import buildEmailTemplate from 'helpers/email';

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

export function sendFirstTimePasscode (email) {
  return new Promise(async (resolve, reject) => {
    try {
      const passCode = Math.floor(10000 + Math.random() * 9000);
      await buildEmailTemplate({
        from    : process.env.MG_FROM_EMAIL,
        to      : email,
        subject : 'Código Inicial',
        title   : 'Código de inicial de instalación',
        content : 'Después de instalar la aplicación en tu dispositivo deberás ingresar el siguiente código para poder accessar a la aplicación.',
        footer  : passCode.toString(),
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
