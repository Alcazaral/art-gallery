import uuid from 'uuid';
import { loadRegisteredUserByEmail } from '../../lib/user';
import { resetPassword as sendResetPasswordEmail } from '../../../email';
import db from '../../../../database/client';

export default async function newPassword(ctx) {
  const user = await loadRegisteredUserByEmail(ctx.request.body.email);

  if (!user) {
    ctx.response.status = 200;
    return;
  }

  const token = uuid.v4();

  await db.none(`
    INSERT INTO user_password_reset
    (user_id, token)
    VALUES ($1, $2)`, [
      user.id,
      token,
    ]);

  await sendResetPasswordEmail(user.email, token);

  ctx.response.status = 200;
}
