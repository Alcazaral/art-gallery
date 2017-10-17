
module.exports = {
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  BUCKET: process.env.AWS_S3_BUCKET,
  BUCKET_URL: `https://s3.amazonaws.com/${process.env.AWS_S3_BUCKET}`,
};
