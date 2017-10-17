import db from '../../../database/client';

const debug = require('debug')('app:api:account:updateProfile');

export default async function updateProfile(ctx) {
  const body = ctx.request.body;

  const usernameTaken = await db.oneOrNone(`
    SELECT username FROM users WHERE username = $1 and id != $2`, [
      body.username,
      ctx.state.user.id,
    ]);

  if (usernameTaken) {
    debug('username taken', body);
    ctx.response.status = 409;
    ctx.response.body = {
      username_taken: {
        message: `The username ${body.username} is already taken`,
      },
    };
    return;
  }

  const updateUserProm = db.none(`
    UPDATE users SET
      username = $1,
      location = $2,
      bio = $3,
      available = $4,
      show_email = $5,
      register_step = 'registered'
    WHERE id = $6
  `, [
    ctx.body.username,
    ctx.body.location,
    ctx.body.bio,
    ctx.body.availableForPainting,
    ctx.body.showEmail,
    ctx.state.user.id,
  ]);

  const updateSocialProm = db.none(`
    UPDATE user_social_networks
    SET
      website = $1,
      facebook = $2,
      twitter = $3
    WHERE id = $4`, [
      ctx.body.websiteUrl,
      ctx.body.facebookUrl,
      ctx.body.twitterUrl,
      ctx.state.user.id,
    ]);

  await [updateUserProm, updateSocialProm];

  ctx.response.status = 200;
}
