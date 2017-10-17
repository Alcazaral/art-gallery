import path from 'path';
import shortId from 'shortid';
import { fitCentered } from '../../../libs/image';
import s3 from '../../../libs/s3';
import imgConfig from '../../../../config/img';
import awsConfig from '../../../../config/aws';

const debug = require('debug')('app:modules:shots:uploadShotImg');

export default async function uploadShotImg(ctx) {
  const img = ctx.request.files.img;
  const fileName = img.name.replace(/[^a-zA-Z\d-_.]/g, '-');
  const imgLocalPath = img.path;

  let imageAWSName;

  debug(`got image ${ctx.request.body.type} from user ${ctx.state.user.id}`);

  try {
    imageAWSName = `${shortId.generate()
    }-${fileName}${path.extname(imgLocalPath)}`;

    if (ctx.request.body.type === 'shot') {
      const shotSize = imgConfig.sizes.shotImage;
      const thumbnailLocalPath = await fitCentered(imgLocalPath, shotSize);

      debug(`uploading image original and shot ${imageAWSName} to AWS`);
      await [
        s3.upload(imgLocalPath, `originals/${imageAWSName}`),
        await s3.upload(thumbnailLocalPath, `shots/${imageAWSName}`),
      ];

      ctx.response.status = 200;
      ctx.response.body = {
        imgName: imageAWSName,
      };
      return;
    }

    // Generate attachment's thumbnail
    const thumbnailSize = imgConfig.sizes.thumbnailImage;
    const thumbnailLocalPath = await fitCentered(imgLocalPath, thumbnailSize);

    debug(`uploading image original and thumbnail ${imageAWSName} to AWS`);
    await [
      s3.upload(imgLocalPath, `originals/${imageAWSName}`),
      await s3.upload(thumbnailLocalPath, `thumbnails/${imageAWSName}`),
    ];

    ctx.response.status = 200;
    ctx.response.body = {
      imgName: imageAWSName,
    };
  } catch (e) {
    debug('Error updating image', e);
    ctx.response.status = 409;
    ctx.response.body = {
      error: "Error uploading image",
    };
  }
}
