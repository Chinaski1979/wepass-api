import _ from 'lodash';

// Helpers
import buildEmailTemplate from 'helpers/email';

// Services
// import { userValidation } from './validations';

// Models
import UserModel from './userModel';
import FirstTimePasscodeModel from './firstTimePasscodeModel';

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

function generateFirstTimePasscode (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let passCodeDoc;
      const passcode = Math.floor(10000 + Math.random() * 9000);

      // Verify that the pass code doesn't already exist
      const passcodeExists = await FirstTimePasscodeModel.findOne({passcode});
      if (_.isNull(passcodeExists)) {
        passCodeDoc = await FirstTimePasscodeModel.create({user : userId, passcode});
        resolve(passCodeDoc);
      } else {
        await generateFirstTimePasscode();
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function sendFirstTimePasscode (userAccount) {
  return new Promise(async (resolve, reject) => {
    try {
      const { passcode } = await generateFirstTimePasscode(userAccount._id);
      await buildEmailTemplate({
        from    : process.env.MG_FROM_EMAIL,
        to      : newAccount.email,
        subject : 'Código Inicial',
        title   : 'Código inicial de instalación',
        content : 'Después de instalar la aplicación en tu dispositivo deberás ingresar el siguiente código para poder accessar a la aplicación.',
        footer  : passcode.toString(),
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
