import {
  setUserLike,
  removeUserLike,
  increaseLikeCount,
  decreaseLikeCount,
} from '../lib/shots';

const debug = require('debug')('app:modules:shots:loadShot');

export default async function likeSet(ctx) {
  const liked = ctx.body.liked;

  try {
    if (!liked) {
      debug('removing user like for shot', ctx.state.user.id);
      await [
        removeUserLike(ctx.state.user.id, ctx.body.shotId),
        decreaseLikeCount(ctx.body.shotId),
      ];
    } else {
      debug('setting user like for shot', ctx.body.shotId);
      await [
        setUserLike(ctx.state.user.id, ctx.body.shotId, ctx.body.shotUrl),
        increaseLikeCount(ctx.body.shotId),
      ];
    }
  } catch (e) {
    ctx.response.status = 409;
    ctx.response.body = {
      no_change_in_like: {
        message: 'This shot was already in this liked state',
      },
    };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = {};
}
