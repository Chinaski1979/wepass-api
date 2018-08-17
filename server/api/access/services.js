import moment from 'moment';
import _ from 'lodash';
import {getCurrentTime} from 'helpers/timeZone';

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
  accessCode.verifiedAt = getCurrentTime();
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

function isCodeExpired (createdDate) {
  const expirationDate = moment(createdDate);
  expirationDate.add(7, 'hours');
  const currentTime = getCurrentTime();
  return currentTime.isAfter(expirationDate, 'minute');
}

export function setResolutionCode (accessCode) {
  let resolutionCode;
  const necessaryDeets = ['firstName', 'lastName', 'documentID'];
  const missingDetails = _.filter(necessaryDeets, deet => _.isUndefined(accessCode.visitor[deet]));
  if (isCodeExpired(accessCode.createdAt)) {
    resolutionCode = 3;
  } else if (missingDetails.length) {
    resolutionCode = 2;
  } else {
    resolutionCode = 1;
  }
  return { resolutionCode, missingDetails };
}
