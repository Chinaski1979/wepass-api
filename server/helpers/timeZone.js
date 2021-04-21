import moment from 'moment';
// This helper will change eventually when we want to support multiple timezones.
// In the meantime it will be a simple function. So the logic to be changed will be in one place only.
export function getCurrentTime () {
  return moment().utc().subtract(6, 'hours');
}
