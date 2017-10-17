import {
  loadUserByEmail,
  getPasswordResetTokenByEmail,
  invalidateToken,
  setUserPassword,
} from '../../lib/user';

const debug = require('debug')('app:modules:auth:passwordResets:editPassword');

export default async function editPassword(ctx) {
  ctx.validateBody('email')
    .required('Email is required')
    .isEmail('Invalid email');

  ctx.validateBody('password')
    .required('Password is required')
    .isLength(6, 50);

  ctx.validateBody('token')
    .required('Token is required')
    .isUuid('v4');

  const tokenRes = await getPasswordResetTokenByEmail(
    ctx.vals.email, ctx.vals.token);
  if (!tokenRes) {
    ctx.response.status = 409;
    return;
  }

  await invalidateToken(tokenRes.id);

  const user = await loadUserByEmail(ctx.vals.email);

  await setUserPassword(user.id, ctx.vals.password);

  debug('Set new password for user', user.id);

  ctx.cookies.set('token', '', { expires: new Date(1), path: '/' });
  ctx.response.status = 200;
}
