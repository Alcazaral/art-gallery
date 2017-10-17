import promisify from 'es6-promisify';
import authConfig from '../../../../../config/auth';

const Twitter = promisify(require('twitter-oauth-agent'));

export default async function twitterToken(ctx) {
  let token;
  try {
    token = await new Twitter({
      consumer_key: authConfig.providersConfig.twitter.consumer_key,
      consumer_secret: authConfig.providersConfig.twitter.consumer_secret,
      callback: authConfig.providersConfig.twitter.callback,
    });
  } catch (e) {
    console.error('request twitter token failed', e.message, e.stack);
    ctx.response.status = 500;
    ctx.response.body = 'Error requesting twitter token';
    ctx.redirect('/error');
    return;
  }

  ctx.response.body = { token };
}
