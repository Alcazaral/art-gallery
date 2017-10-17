import {
  userSessionFields,
} from '../../lib/user';
import {
  createRegisterToken,
} from '../../lib/session';
import db from '../../../../database/client';
import cookiesConfig from '../../../../../config/cookies';

const debug = require('debug')('app:signup:setupAccount');

export default async function setupAccount(ctx) {
  if (
    ctx.state.user.register_step !== 'setup_account' ||
    (
        ctx.state.user.register_mode !== 'oauth' &&
        ctx.state.user.register_mode !== 'email'
    )) {
    debug('account not valid', ctx.state.user);
    // TODO: If the user is already logged in redirect to home
    ctx.response.body = 'Account not valid for oauth confirm';
    ctx.response.status = 401;
    return;
  }

  debug(`setting up userId (${ctx.state.user.id}) account`);

  const { exists: usernameExists } = await db.one(`
    SELECT EXISTS (SELECT * FROM users WHERE username = $1)
    `, [ctx.body.username]);

  if (usernameExists) {
    ctx.response.status = 409;
    ctx.response.body = {
      username_taken: {
        message: `The user ${ctx.body.username} is already registered`,
        value: ctx.body.username,
      },
    };
    return;
  }

  debug('user profile', ctx.body);

  const userProfile = await db.one(`
    UPDATE users SET
      username = $1,
      location = $2,
      bio = $3,
      available = $4,
      show_email = $5,
      register_step = 'registered'
    WHERE id = $6
    RETURNING ${userSessionFields}
  `, [
    ctx.body.username,
    ctx.body.location,
    ctx.body.bio,
    ctx.body.availableForPainting,
    ctx.body.showEmail,
    ctx.state.user.id,
  ]);

  const socialProfiles = await db.one(`
    INSERT INTO user_social_networks
    (user_id, website, facebook, twitter)
    VALUES
    ($1, $2, $3, $4)
    RETURNING website, facebook, twitter`, [
      ctx.state.user.id,
      ctx.body.websiteUrl,
      ctx.body.facebookUrl,
      ctx.body.twitterUrl,
    ]);

  userProfile.socialProfiles = socialProfiles;

  const token = createRegisterToken(
    userProfile.id,
    'member',
    'oauth',
    'registered',
  );

  debug('user profile', userProfile);

  ctx.cookies.set('token', token, cookiesConfig);
  ctx.response.status = 200;
  ctx.response.body = {
    user: userProfile,
  };
}
