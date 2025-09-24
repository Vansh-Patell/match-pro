const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'us-west-2', // Change this if you used a different region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

const BUCKET_NAME = 'match-pro-resumes-1758748543';

module.exports = {
  s3,
  BUCKET_NAME
};