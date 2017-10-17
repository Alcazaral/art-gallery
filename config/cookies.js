module.exports = {
  // TODO: set cookie config
  maxAge: 60 * 60 * 24 * 150 * 1000, // 150 days in seconds
  host: process.env.APP_HOST,
  // domain: process.env.APP_DOMAIN,
  // safe:   true,
  httpOnly: true,
  path: '/',
};
