import model from '../lib/shots';

const debug = require('debug')('app:api:shots:loadShots');

export default async function loadShots(ctx) {
  const body = ctx.request.body;
  const userId = ctx.state.user ? ctx.state.user.id : null;

  let shots;
  if (body.textSearch) {
    shots = await model.search({
      userId,
      textQuery: body.textSearch.trim().replace(/\s/g, ' | '),
      offset: body.offset,
    });
  } else {
    shots = await model.get({
      userId,
      gameId: body.gameId,
      armyId: body.armyId,
      time: Number(body.time),
      sort: body.sort,
      offset: body.offset,
    });
  }

  debug(`got ${shots.length} shots`);

  const galleryState = shots.reduce((acc, val) => {
    acc.shotsOrder.push(val.url);
    acc.shots[val.url] = val;
    return acc;
  }, { shots: {}, shotsOrder: [] });

  ctx.response.status = 200;
  ctx.response.body = galleryState;
}
