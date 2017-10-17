const { hostUrl } = require('./host');

const saltRounds = parseInt(process.env.PWD_SALT_ROUNDS, 10);

// var shouldHidePort = (port === ':80' && host.indexOf('http://') === 0)
//   || (port === ':443' && host.indexOf('https://') === 0);

// if (shouldHidePort) {
//   port = '';
// }

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  saltRounds,
  providersConfig: {
    twitter: {
      consumer_key: process.env.OAUTH_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.OAUTH_TWITTER_CONSUMER_SECRET,
      callback: `${hostUrl}/signup/twitter/callback/`,
    },

    facebook: {
      client_id: process.env.OAUTH_FACEBOOK_ID,
      client_secret: process.env.OAUTH_FACEBOOK_SECRET,
      redirect_uri: `${hostUrl}/signup/facebook/callback/`,
      scope: ['email'],
    },

    google: {
      client_id: process.env.OAUTH_GOOGLE_ID,
      client_secret: process.env.OAUTH_GOOGLE_SECRET,
      redirect_uri: `${hostUrl}/signup/google/callback/`,
      scope: 'email',
    },
  },
};
