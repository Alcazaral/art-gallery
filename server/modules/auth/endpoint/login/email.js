import {
  validateEmailPassword,
  loadUserSocialProfiles,
} from '../../lib/user';

import {
  createSessionToken,
} from '../../lib/session';

import cookiesConfig from '../../../../../config/cookies';

const debug = require('debug')('app:modules:auth:login:email');

export default async function email(ctx) {
  debug(`Loging user with email ${ctx.request.body.email}`);

  let user;
  try {
    debug('validating', ctx.request.body.email, ctx.request.body.password);
    user = await validateEmailPassword(
      ctx.request.body.email, ctx.request.body.password);
  } catch (e) {
    if (e.message === 'email_does_not_exists'
      || e.message === 'wrong_password') {
      ctx.response.status = 409;
      ctx.response.body = {
        email_password_invalid: {
          message: 'Email or password invalid',
        },
      };
      return;
    }
    throw (e);
  }

  debug(`Got user ${user.id}`);

  const socialProfiles = await loadUserSocialProfiles(user.id);
  user.socialProfiles = socialProfiles;

  debug(`Creating user session`);
  const token = createSessionToken(user.id, user.role, 'registered');

  ctx.cookies.set('token', token, cookiesConfig);

  ctx.response.status = 200;
  ctx.response.body = { user };
}
