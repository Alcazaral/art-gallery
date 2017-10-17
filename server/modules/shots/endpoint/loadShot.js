import {
  loadMoreByUser,
  loadShotForUser,
  loadShot as loadShotForAnonim,
  increaseViewCount,
} from '../lib/shots';

const debug = require('debug')('app:modules:shots:loadShot');

export default async function loadShot(ctx) {
  debug('loading shot', ctx.body.url);

  let shot;
  if (ctx.state.user) {
    debug('loading shot for logged user');
    shot = await loadShotForUser(ctx.body.url, ctx.state.user.id);
  } else {
    debug('loading shot for anonymous user');
    shot = await loadShotForAnonim(ctx.body.url);
  }

  if (!shot) {
    debug('shot not found');
    ctx.response.status = 404;
    ctx.response.body = {};
    return;
  }

  const moreShots = await loadMoreByUser(shot.user_id, ctx.body.url);

  debug('got shot', shot.url);

  shot.moreByUser = moreShots;

  ctx.response.status = 200;
  ctx.response.body = shot;

  increaseViewCount(shot.id)
  .then(() => debug('views count updated', shot.id))
  .catch(() => debug('[Error] updating views count', shot.id));
}
