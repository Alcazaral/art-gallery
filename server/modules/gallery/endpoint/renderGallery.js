import model from '../lib/shots';
import render from '../../../render';

const debug = require('debug')('app:modules:gallery:renderGallery');

module.exports = async function renderGallery(ctx) {
  const userId = ctx.state.user ? ctx.state.user.id : null;
  const shots = await model.get({ userId });

  debug(`got ${shots.length} shots`);

  const galleryState = shots.reduce((acc, val) => {
    acc.shotsOrder.push(val.url);
    acc.shots[val.url] = val;
    return acc;
  }, { shots: {}, shotsOrder: [] });

  const state = {
    currentPage: 'gallery',
    gallery: galleryState,
  };

  await render({ state, ctx });
};
