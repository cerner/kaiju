import rp from 'request-promise';
import config from 'config';

const { URL } = require('url');


class ServiceRequestor {
  constructor(cookies) {
    this.sessionName = config.get('cookieKey');
    this.sessionId = cookies[this.sessionName];
    this.requestPromise = rp;
  }

  request(path) {
    const options = {
      url: new URL(path, config.get('railsServerUrl')),
      headers: {
        Cookie: `${this.sessionName}=${this.sessionId}`,
      },
      json: true,
    };

    return this.requestPromise(options);
  }
}

export default ServiceRequestor;
