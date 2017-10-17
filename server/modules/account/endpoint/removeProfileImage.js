import db from '../../../database/client';

export default async function removeProfileImage(ctx) {
  await db.none(`UPDATE users SET image = '' WHERE id = $1`, [
    ctx.state.user.id,
  ]);

  ctx.response.status = 200;
  ctx.response.body = {};
}
