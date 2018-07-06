import _ from 'lodash';

// Helpers
import buildEmailTemplate from 'helpers/email';
import sms from 'helpers/sms';

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
      const { passcode: userPasscode } = await generateFirstTimePasscode(userAccount._id);
      const emailBody = userAccount.role === 'agent'
        ? 'Tu codigo para ingresar en wepass Agent.'
        : 'Después de instalar la aplicación en tu dispositivo deberás ingresar el siguiente código para poder accessar a la aplicación.';

      const sendEmail = (email, body, passcode) => buildEmailTemplate({
        from    : process.env.MG_FROM_EMAIL,
        to      : email,
        subject : 'Código Inicial',
        title   : 'Código inicial de instalación',
        content : body,
        footer  : passcode.toString(),
      });

      if (userAccount.role === 'agent') {
        if (!_.isEmpty(userAccount.email)) {
          const emailResponse = await sendEmail(userAccount.email, emailBody, userPasscode);
          resolve(emailResponse);
        } else if (_.isEmpty(userAccount.email) && !_.isEmpty(userAccount.phoneNumber)) {
          const smsResponse = await sms({
            body : `Tu codigo para ingresar en wepass Agent: ${userPasscode.toString()}`,
            from : process.env.TW_PHONE_NUMBER,
            to   : userAccount.phoneNumber,
          });

          resolve(smsResponse);
        }
      } else {
        const emailResponse = await sendEmail(userAccount.email, emailBody, userPasscode);
        resolve(emailResponse);
      }
    } catch (err) {
      reject(err);
    }
  });
}
