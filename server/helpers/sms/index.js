import { smsData } from './validationSchemas';
import Twilio from 'twilio';

const twilio = new Twilio(process.env.TW_SID, process.env.TW_AUTH_TOKEN);

export default function sendSms (data) {
  return new Promise(async (resolve, reject) => {
    try {
      const { result } = await smsData(data);
      const { sid } = await twilio.messages.create(result);
      resolve(sid);
    } catch (err) {
      reject(err);
    }
  });
}
