import { updateUserPassword } from '../../auth/lib/user';

export default async function updatePassword(ctx) {
  const body = ctx.request.body;

  try {
    await updateUserPassword(
      ctx.state.user.email,
      body.oldPassword,
      body.newPassword);
  } catch (e) {
    if (e.message === 'username_does_not_exists'
      || e.message === 'wrong_password') {
      ctx.response.status = 409;
      ctx.response.body = {
        email_password_invalid: {
          message: 'Email or password invalid',
        },
      };
      return;
    }
    throw (e);
  }

  ctx.response.status = 200;
}
