/**
 * Formats an ISO date string
 * @param {String} isoDate - An ISO String
 * @return {String} - A formatted date String
 */
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const hours = (date.getHours() % 12 === 0) ? 12 : date.getHours() % 12;
  const minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
  const suffix = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${date.toDateString()} ${hours}:${minutes} ${suffix}`;
};

/**
 * TODO: Assess the value and reusability of this function
 * Filters a flattened properties Object for root properties
 * @param {Object} properties - The properties Object
 * @return {Object} - An Object consisting of root properties
 */
const getRootProps = (properties) => (
  Object.keys(properties).filter((property) => property.indexOf('::') === -1)
);

/**
 * Transforms camel case into sentence structure
 * @param {String} string - The String to humanize
 * @return {String} - A humanized String
 */
const humanize = (string) => {
  const result = string.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export {
  formatDate,
  getRootProps,
  humanize,
};
