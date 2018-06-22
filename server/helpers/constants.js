module.exports = {
  TOKENS_TIME : {
    AUTH    : '1d',
    REFRESH : '60d',
  },
  PUBLIC_ROUTES : [
    '/auth/login',
    '/auth/createAccount',
    '/auth/trialRegistration',
  ],
  eventsWhiteList : ['pending', 'started', 'finished', 'canceled'],
};
