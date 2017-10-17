import Validr from 'validr';
import { getPasswordResetTokenByEmail } from '../../lib/user';
import render from '../../../../render';

const debug = require('debug')('app:modules:auth:renderSetNewPasswordPage');

export default async function renderSetNewPasswordPage(ctx) {
  const params = ctx.params;
  debug('got request with params', params);

  const validr = new Validr(params);

  validr.validate('email').isEmail();

  validr.validate('token').isUUID();

  const errors = validr.validationErrors();
  if (errors) {
    debug('Got validation errors', errors);
    ctx.redirect('/');
    return;
  }

  const tokenRes = await getPasswordResetTokenByEmail(
    params.email, params.token);

  if (!tokenRes) {
    ctx.redirect('/');
    return;
  }

  const state = {
    currentPage: 'password-resets/edit',
    auth: {
      resetPassword: {
        resetData: {
          email: params.email,
          token: params.token,
        },
      },
    },
  };

  await render({ state, ctx });
}
