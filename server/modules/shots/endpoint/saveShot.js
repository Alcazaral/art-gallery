import shortId from 'shortid';
import { getDefaultBucket } from '../lib/buckets';
import db from '../../../database/client.js';

const debug = require('debug')('app:modules:shots:saveShot');

export default async function saveShot(ctx) {
  const { body } = ctx.request;

  debug(`saving shot with data`, body);

  const bucket = await getDefaultBucket(ctx.state.user.id);

  debug(`got user bucket`, bucket);

  const shot = ctx.request.body;

  const url =
    `${shortId.generate()}-${shot.title.replace(/[^a-zA-Z\d-_.]/g, '-')}`;

  const newShot = await db.one(
    `INSERT INTO "shots"
    (
      user_id,
      title,
      description,
      game_id,
      army_id,
      bucket_id,
      url,
      image,
      attachments
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9::text[]) RETURNING *`,
    [
      ctx.state.user.id,
      shot.title,
      shot.description,
      shot.game,
      shot.army,
      bucket.id,
      url,
      shot.shotImg,
      shot.attachmentsImgs,
    ],
  );

  debug("shot saved", newShot);

  ctx.response.status = 200;
  ctx.response.body = newShot;
}
