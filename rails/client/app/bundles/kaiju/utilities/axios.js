import axios from 'axios';

/**
 * @return {String} - The csrf-token
 */
const getCSRFToken = () => (
  document.querySelector('meta[name="csrf-token"]').getAttribute('content')
);

export default axios.create({
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  transformRequest: (data, headers) => {
    // eslint-disable-next-line no-param-reassign
    headers['X-CSRF-Token'] = getCSRFToken();
    return JSON.stringify(data);
  },
});
