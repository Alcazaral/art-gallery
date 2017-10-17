import s3 from 's3';
import aws from '../../../config/aws';

const debug = require('debug')('app:libs:s3');

const S3Mock = {
  upload: async () => {},
  download: async () => {},
};

class S3 {
  constructor() {
    this.client = s3.createClient({
      s3Options: {
        accessKeyId: aws.ACCESS_KEY_ID,
        secretAccessKey: aws.SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Upload a file to S3
   * @param  {string} filePath - the path of the file to upload
   * @param {string} key - the key used to upload it to s3
   * @return {Promise}
   */
  upload(filePath, key) {
    debug(`Uploading ${filePath} to ${key}`);

    const params = {
      localFile: filePath,

      s3Params: {
        Bucket: aws.BUCKET,
        Key: key,
      },
    };

    return new Promise((resolve, reject) => {
      const uploader = this.client.uploadFile(params);

      uploader.on('error', reject);
      uploader.on('end', resolve);
    });
  }

  /**
   * Download a file from S3
   * @param  {Object} params Object parameters
   * @return {Object}        Promise
   */
  download(params) {
    return new Promise((resolve, reject) => {
      const downloader = this.client.downloadFile(params);

      downloader.on('error', reject);
      downloader.on('end', resolve);
    });
  }

}


export default aws.ACCESS_KEY_ID ? new S3() : S3Mock;
