import rp from 'request-promise';
import config from 'config';

const { URL } = require('url');


class ServiceRequestor {
  constructor(cookies, req) {
    this.sessionName = config.get('cookieKey');
    this.sessionId = cookies[this.sessionName];
    this.requestPromise = rp;
    this.baseURL = req.fullUrl();
    if (config.has('railsServerUrl')) {
      this.baseURL = config.get('railsServerUrl');
    }
  }

  request(path) {
    const options = {
      url: new URL(path, this.baseURL),
      headers: {
        Cookie: `${this.sessionName}=${this.sessionId}`,
      },
      json: true,
    };

    return this.requestPromise(options);
  }
}

export default ServiceRequestor;
