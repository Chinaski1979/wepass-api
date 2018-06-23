import { emailData } from './validationSchemas';
import Mailgun from 'mailgun-js';

export default function buildEmailTemplate (type, data) {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate if the data meet the required fields in order to correctly populate the template
      const html = await emailData(type, data);
      const mailgun = new Mailgun({ apiKey : process.env.MG_API_KEY, domain : process.env.MG_DOMAIN });
      const emailConfig = Object.assign(data, { html : html.template });
      // console.log(emailConfig);
      // const email = await mailgun.messages().send(emailConfig, (err, body) => {
      //   console.log('mailgun response', mailgun, body, err);
      // });

      mailgun.messages().send(emailConfig, (err, body) => {
        if (err) {
          console.log('got an error: ', err);
        }
        console.log(body);
        resolve('body', body);
      });
    } catch (err) {
      console.log('error', err);
      reject(err);
    }
  });
}
