
let hostUrl;
if (process.env.NODE_ENV === 'development') {
  hostUrl = `${process.env.APP_HOST}:${process.env.APP_PORT}`;
} else {
  hostUrl = process.env.APP_HOST;
}

module.exports = {
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
  hostUrl,
  email: process.env.APP_EMAIL,
};
