import db from '../../../database/client';

module.exports = async function deleteAccount(ctx) {
  await db.one('UPDATE users SET deleted = true WHERE id = $1 returning id',
    ctx.state.user.id);

  ctx.cookies.set('token', '', { expires: new Date(1), path: '/' });
  ctx.response.status = 200;
  ctx.response.body = {};
};
