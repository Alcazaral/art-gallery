import db from '../../../../database/client';
import { createRegisterToken } from '../../lib/session';
import cookiesConfig from '../../../../../config/cookies';

const debug = require('debug')('app:signup');

export default async function confirm(ctx) {
  debug(`received validation token url
    email: ${ctx.params.email}
    validationToken: ${ctx.params.validationToken}`);

  const user = await db.oneOrNone(`
    SELECT id, register_step, validation_token FROM users
    WHERE
      email = $1 AND
      validation_token = $2 AND
      register_step = $3`, [
        ctx.params.email,
        ctx.params.validationToken,
        'email_confirm',
      ]);

  if (user) {
    debug('user not validated found, rendering setup account');

    await db.none(`UPDATE users SET register_step = $1 WHERE id = $2`,
      ['setup_account', user.id]);

    const token = createRegisterToken(
      user.id, 'member', 'email', 'setup_account');

    ctx.cookies.set('token', token, cookiesConfig);
    ctx.redirect('/signup/setup-account');
    return;
  }

  debug('user not validated not found, redirecting to home');
  ctx.redirect('/error');
}
