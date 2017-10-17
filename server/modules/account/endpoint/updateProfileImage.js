import path from 'path';
import uuid from 'uuid';
import db from '../../../database/client';
import { fitCentered } from '../../../libs/image';
import s3 from '../../../libs/s3';
import imgConfig from '../../../../config/img';

const debug = require('debug')('app:modules:account:updateProfileImage');

export default async function updateProfileImage(ctx) {
  const imageLocalPath = ctx.request.files.img.path;

  let imageAWSKey;
  let imageName;

  debug(`updating profile image from user ${ctx.state.user.id}`);

  try {
    const fitSize = imgConfig.sizes.userImage;
    const fitedImagePath = await fitCentered(imageLocalPath, fitSize);

    imageName = uuid.v4() + path.extname(fitedImagePath);
    imageAWSKey = `users/avatars/${imageName}`;

    await s3.upload(fitedImagePath, imageAWSKey);
  } catch (e) {
    debug('Error updating image', e);
    ctx.response.status = 409;
    ctx.response.body = {
      error: "Error uploading image",
    };
    return;
  }

  await db.none(`UPDATE users SET image = $1 WHERE id = $2`, [
    imageName,
    ctx.state.user.id,
  ]);

  ctx.response.status = 200;
  ctx.response.body = { image: imageName };
}
