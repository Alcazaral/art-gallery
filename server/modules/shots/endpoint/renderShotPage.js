import {
  loadShotForUser,
  loadShot as loadShotForAnonim,
  loadMoreByUser,
  increaseViewCount,
} from '../lib/shots';
import render from '../../../render';

const debug = require('debug')('app:modules:shots:renderShotPage');

export default async function renderShotPage(ctx) {
  let shot;
  if (ctx.state.user) {
    debug(`loading shot ${
      ctx.params.shotUrl} for logged user ${ctx.state.user.id}`);
    shot = await loadShotForUser(ctx.params.shotUrl, ctx.state.user.id);
  } else {
    debug('loading shot for anonymous user');
    shot = await loadShotForAnonim(ctx.params.shotUrl);
  }

  if (!shot) {
    debug('shot not found, redirecting to 404');
    ctx.redirect('/404');
    return;
  }

  const moreShots = await loadMoreByUser(shot.user_id, ctx.params.shotUrl);

  debug('got shot, rendering page', shot.url);

  shot.moreByUser = moreShots;
  const state = {
    currentPage: `shots/shot`,
    currentQuery: ctx.params.shotUrl,
    shotPage: {
      shots: {
        [shot.url]: shot,
      },
    },
  };

  await render({ state, ctx });

  increaseViewCount(shot.id)
  .then(() => debug('views count updated', shot.id))
  .catch(() => debug('[Error] updating views count', shot.id));
}
