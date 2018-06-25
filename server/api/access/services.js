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

export function setUpAccessHistoryQuery (parentProperty, fromDate, toDate) {
  const startDate = moment(fromDate).utc().subtract(6, 'hours');
  let endDate;
  startDate.startOf('day');
  if (toDate) {
    endDate = moment(toDate).utc().subtract(6, 'hours');
  } else {
    endDate = moment(fromDate).utc().subtract(6, 'hours');
  }
  endDate.endOf('day');
  return { verifiedAt : {'$gte' : startDate.format(), '$lt' : endDate.format()}, parentProperty, verified : true };
}
