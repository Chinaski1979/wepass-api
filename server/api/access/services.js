import moment from 'moment';

export function matchesParentProperties (accessCode, agent) {
  return new Promise((resolve, reject) => {
    if (accessCode.unit.parentProperty !== agent.property) {
      reject({message : 'Parent properties don\'t match' });
    } else {
      resolve();
    }
  });
}

export function updateAccessCode (accessCode, agent) {
  accessCode.verified = true;
  accessCode.verifiedBy = agent._id;
  accessCode.verifiedAt = moment().utc().subtract(6, 'hours');
}
