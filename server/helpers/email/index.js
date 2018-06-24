import { emailData } from './validationSchemas';
import Mailgun from 'mailgun-js';
const mailgun = new Mailgun({ apiKey : process.env.MG_API_KEY, domain : process.env.MG_DOMAIN });

export default function buildEmailTemplate (data) {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate if the data meet the required fields in order to correctly populate the template
      const html = await emailData(data);
      const emailConfig = Object.assign(data, { html : html.template });
      const email = await mailgun.messages().send(emailConfig);
      resolve(email);
    } catch (err) {
      reject(err);
    }
  });
}
