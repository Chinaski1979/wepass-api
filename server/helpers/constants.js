module.exports = {
  TOKENS_TIME : {
    AUTH    : '1d',
    REFRESH : '60d',
  },
  PUBLIC_ROUTES : [
    '/auth/login',
    '/auth/trialRegistration',
    '/auth/firstTimeAccess',
    '/user/resetPasswordForm',
    '/user/sendResetPasswordEmail',
  ],
  ADMIN_ROUTES : [
    '/auth/createAccount',
  ],
  eventsWhiteList : ['pending', 'started', 'finished', 'canceled'],
};
