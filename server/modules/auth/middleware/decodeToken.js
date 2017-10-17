import inspect from 'util-inspect';
import { verify } from '../lib/token';
import { loadSessionUser, loadUserSocialProfiles } from '../lib/user';

const debug = require('debug')('app:middleware:decodeToken');

export default function () {
  return async function decodeCookie(ctx, next) {
    const token =
      ctx.request.headers.authorization ||
      ctx.cookies.get('token') ||
      ctx.request.query.token;

    if (!token) {
      debug('user is visitor');
      await next();
      return;
    }

    let tokenPayload;
    try {
      tokenPayload = await verify(token);
    } catch (e) {
      console.warn('Invalid token', tokenPayload);
      console.log('Removing token from cookies');
      ctx.cookies.set('token', '', { expires: new Date(1), path: '/' });
      await next();
      return;
    }

    let userRes;
    try {
      userRes = await loadSessionUser(
        tokenPayload.userId, tokenPayload.registerStep);
    } catch (err) {
      console.error(`Error loading session from user ${
        tokenPayload.userId} error: ${err.message}`);
      ctx.cookies.set('token', '', { expires: new Date(1), path: '/' });
      await next();
      return;
    }

    if (!userRes) {
      ctx.cookies.set('token', '', { expires: new Date(1), path: '/' });
      console.error('User not found for token', inspect(tokenPayload));
      await next();
      return;
    }

    const userProfiles = await loadUserSocialProfiles(userRes.id);
    if (userProfiles) {
      userRes.socialProfiles = userProfiles;
    }

    debug(`Got user session ${userRes.id}`);

    ctx.state.user = userRes;
    await next();
  };
}
