import promisify from 'es6-promisify';
import request from 'request';
import db from '../../../../database/client';
import { createRegisterToken } from '../../lib/session';
import authConfig from '../../../../../config/auth';
import cookiesConfig from '../../../../../config/cookies';

const debug = require('debug')('app:api:signup:registerOauth');

const providers = {
  twitter: promisify(require('twitter-oauth-agent')),
  facebook: promisify(require('facebook-oauth-agent')),
  google: promisify(require('google-oauth-agent')),
};

async function getTwitterProfile(ctx) {
  const providerConfig = authConfig.providersConfig[ctx.request.body.provider];

  const profile = await providers[ctx.request.body.provider]({
    consumer_key: providerConfig.consumer_key,
    consumer_secret: providerConfig.consumer_secret,
    oauth_verifier: ctx.request.body.code.oauth_verifier,
    oauth_token: ctx.request.body.code.oauth_token,
  });

  debug(`Got user's profile`);

  // Twitter does not return the email as part of the oauth exchange -.-
  // Request user's email from twitter

  const apiEndpoint = 'https://api.twitter.com/1.1/'
    + 'account/verify_credentials.json?include_email=true';

  const oauth = {
    consumer_key: providerConfig.consumer_key,
    consumer_secret: providerConfig.consumer_secret,
    token: profile.access_token,
    token_secret: profile.access_token_secret,
  };

  const credentials = await new Promise((resolve, reject) => {
    request.get({
      url: apiEndpoint,
      oauth,
      json: true,
    }, (err, response, body) => {
      if (body.errors) {
        return reject(new Error(
          body.errors.map((error) => { return error.message; }).join('. ')
        ));
      }
      resolve(body);
    });
  });

  debug('Got twitter credentials');

  profile.email = credentials.email;

  return profile;
}

async function getGoogleOrFacebookProfile(ctx) {
  const providerConfig = authConfig.providersConfig[ctx.request.body.provider];

  debug(`Requesting ${ctx.request.body.provider} oauth`, {
    code: ctx.request.body.code,
    client_id: providerConfig.client_id,
    client_secret: providerConfig.client_secret,
    redirect_uri: providerConfig.redirect_uri,
  });

  const profile = await providers[ctx.request.body.provider]({
    code: ctx.request.body.code,
    client_id: providerConfig.client_id,
    client_secret: providerConfig.client_secret,
    redirect_uri: providerConfig.redirect_uri,
  });

  debug(`Got ${ctx.request.body.provider} credentials`, profile);

  return profile;
}

async function oauthCode(ctx) {
  // TODO: If the user is already logged in redirect to home

  debug('Received oauthCode', ctx.request.body);

  let profile;
  try {
    if (ctx.request.body.provider === 'twitter') {
      profile = await getTwitterProfile(ctx);
    } else {
      profile = await getGoogleOrFacebookProfile(ctx);
    }

    profile = {
      email: profile.email,
      provider: ctx.request.body.provider,
      providerId: profile.id || profile.sub,
    };

    if (!(
      profile.email &&
      profile.provider &&
      profile.providerId)
      ) {
      debug('Invalid profile data', profile);
      throw new Error('Invalid profile data');
    }
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = {
      errors: ['Error getting profile'],
    };
    console.error('Error getting profile from oauth code', e);
    return;
  }

  async function addProvider(provider, userId, providerId) {
    await db.none(`
      INSERT INTO users_oauth_providers
      (user_id, $[provider_name:name])
      VALUES($[user_id:value], $[provider_id:value])`, {
        provider_name: `${provider}_id`,
        user_id: userId,
        provider_id: providerId,
      });
  }

  async function addProviderIfNotExists(provider, userId, providerId) {
    const providerRes = await db.oneOrNone(`
      SELECT * FROM users_oauth_providers
      WHERE
      user_id = $[user_id:value] AND
      $[provider_name:name] = $[provider_id:value]
      `, {
        provider_name: `${provider}_id`,
        user_id: userId,
        provider_id: providerId,
      });

    if (!providerRes) {
      await addProvider(provider, userId, providerId);
    }
  }

  let userRes = await db.oneOrNone(`
    SELECT email, id, register_step, validation_token
    from users WHERE email = $1`, profile.email);

  // Register the user
  if (!userRes) {
    debug('registering new user', profile);

    userRes = await db.one(`INSERT INTO users
      (email, register_mode, register_step)
      VALUES($1, 'oauth', 'setup_account')
      returning id, email, register_step`, [
        profile.email,
      ]);

    await addProvider(profile.provider, userRes.id, profile.providerId);

    // User already registered
  } else if (userRes.register_step === 'registered') {
    debug('user already registered');
    ctx.response.status = 409;
    ctx.response.body = {
      user_already_registered: {
        message: 'User is already registered',
        provider: profile.provider,
        email: profile.email,
      },
    };
    return;

  // Continue register process
  } else {
    debug('recovering register session', profile);
    await addProviderIfNotExists(
      profile.provider,
      userRes.id,
      profile.providerId);
  }

  const token = createRegisterToken(
    userRes.id,
    'member',
    'oauth',
    userRes.register_step,
  );

  ctx.cookies.set('token', token, cookiesConfig);

  ctx.response.status = 200;
  ctx.response.body = {
    profile: {
      id: userRes.id,
      email: userRes.email,
    },
  };

  debug('Setting register oauth token in cookies');
}

export default oauthCode;
