import uuid from 'uuid';
import { digest as digestPassword } from '../../lib/password';
import { signup as sendSignupMail } from '../../../email';
import db from '../../../../database/client';

const debug = require('debug')('app:api:signup:registerEmail');

export default async function email(ctx) {
  const { exists: emailExists } = await db.one(`
    SELECT EXISTS (SELECT * FROM users WHERE email = $1)
    `, [ctx.request.body.email]);

  if (emailExists) {
    ctx.response.status = 409;
    ctx.response.body = {
      email_taken: {
        message: `The email ${ctx.request.body.email} is already registered`,
      },
    };
    return;
  }

  debug('registering with email', ctx.request.body.email);

  // Register the user
  const validationToken = uuid.v4();
  const passDigest = await digestPassword(ctx.request.body.password);

  await db.one(`
    INSERT INTO USERS
    (email, register_mode, register_step, validation_token, pass_digest)
    VALUES($1, 'email', 'email_confirm', $2, $3) RETURNING id`, [
      ctx.request.body.email,
      validationToken,
      passDigest,
    ],
  );

  await sendSignupMail(ctx.request.body.email, validationToken);

  ctx.response.status = 200;
  ctx.response.body = {
    user: { email: ctx.request.body.email },
  };
}
