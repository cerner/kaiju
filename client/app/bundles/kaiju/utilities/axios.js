import axios from 'axios';

/**
 * @return {String} - The csrf-token
 */
const getCSRFToken = () => (
  document.querySelector('meta[name="csrf-token"]').getAttribute('content')
);

const Axios = axios.create({
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

/**
 * Intercepts every request / reponse before then() and catch() are invoked.
 */
Axios.interceptors.response.use((response) => response, (error) => {
  const { response, request } = error;
  if (response) {
    switch (response.status) {
      case 422: // Unprocessable entity. ( Bad token or expired cookie / session )
      case 403: // Forbidden resource. TODO: Add visual feedback instead of hard refresh.
      case 401: // Unauthorized.
        (window.parent || window).location.reload();
        return Promise.reject(error);
      default:
        // No default behavior
    }
  // The server sent no response. Most likely not connected to the internet.
  } else if (request) {
    (window.parent || window).location.reload();
    return Promise.reject(error);
  }

  return error;
});

export default Axios;
