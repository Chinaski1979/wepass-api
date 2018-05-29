// Models
import CompanyModel from './companyModel';

// Validations
import { companyValidation } from 'validations';

export function createNewCompany (companyDetails) {
  return new Promise(async (resolve, reject) => {
    try {
      const companyDetailsValidated = await companyValidation(companyDetails);
      const company = await CompanyModel.create(companyDetailsValidated);
      resolve(company);
    } catch (err) {
      reject(err);
    }
  });
}
