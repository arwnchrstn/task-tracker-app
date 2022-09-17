// eslint-disable-next-line
const dayInAWeek = Object.freeze([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]);
const months = Object.freeze([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]);

/**
 *
 * @param {Date} date  - Date object
 */
export const dateToStringDate = (date) => {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 *
 * @param {Date} date  - Date object
 */
export const dateToYYYYMMDD = (date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()}`;
};

/**
 *
 * @param {Date} date  - Date object
 */
export const dateToStringDateTime = (date) => {
  return `${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} - ${date.toLocaleTimeString()}`;
};
