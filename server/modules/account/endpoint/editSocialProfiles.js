import Validr from 'validr';
import db from '../../../database/client';

const debug = require('debug')('app:account:endpoint:editSocialProfiles');

export default async function editSocialProfiles(ctx) {
  const body = ctx.request.body;

  const validr = new Validr(body);

  validr.validate('website', {
    isLength: `Social profile website is invalid.`,
  }).isLength(0, 50);

  validr.validate('twitter', {
    isLength: `Social profile twitter is invalid.`,
  }).isLength(0, 50);

  validr.validate('facebook', {
    isLength: `Social profile facebook is invalid.`,
  }).isLength(0, 50);

  validr.validate('instagram', {
    isLength: `Social profile instagram is invalid.`,
  }).isLength(0, 50);

  validr.validate('pinterest', {
    isLength: `Social profile pinterest is invalid.`,
  }).isLength(0, 50);

  validr.validate('youtube', {
    isLength: `Social profile youtube is invalid.`,
  }).isLength(0, 50);

  let errors = validr.validationErrors();

  if (errors) {
    debug('Got validation errors', errors);
    errors = errors
      .reduce((acum, val) => { acum.push(val.msg); return acum; }, []);
    ctx.response.status = 409;
    ctx.response.body = { errors };
    return;
  }

  await db.none(`
    UPDATE user_social_networks
    SET
    website = $1,
    twitter = $2,
    facebook = $3,
    instagram = $4,
    pinterest = $5,
    youtube = $6
    WHERE user_id = $7`, [
      body.website,
      body.twitter,
      body.facebook,
      body.instagram,
      body.pinterest,
      body.youtube,
      ctx.state.user.id,
    ]);

  ctx.response.status = 200;
}
