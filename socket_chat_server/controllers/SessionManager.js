const axios = require('axios');


class SessionManager {
  constructor() {
    this.authEndpoint = process.env['AUTH_ENDPOINT']
    this.jwt = null;
    this.isAuthenticated = false;
  }

  async authenticate(sessionToken) {
    if (!sessionToken || !sessionToken.split('.').length === 3) {
      console.error(`ERROR: Cannot authenticate. Invalid session token. Token = "${sessionToken}"`);
      this.jwt = null;
      this.isAuthenticated = false;
      return;
    }

    let result = null;
    try {
      result = await axios.get(this.authEndpoint, {
        headers: {
          Cookie: `next-auth.session-token=${sessionToken}`
        }
      })
    }
    catch(err) {
      const respData = err?.response?.data;
      const errorMsg = `${err.message} - ${respData?.errorMessage || (respData && JSON.stringify(respData)) || 'unknown'}`
      console.error(errorMsg);
    }

    if (!result || !result.data) {
      this.jwt = null;
      this.isAuthenticated = false;
    }
    else {
      this.jwt = result.data;
      this.isAuthenticated = true;
    }

    return this.isAuthenticated;
  }
}

module.exports = new SessionManager();

