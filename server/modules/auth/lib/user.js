import db from '../../../database/client';
import {
  compare as comparePwd,
  digest as digestPassword,
} from './password';

export const userSessionFields = `
  id,
  username,
  email,
  location,
  image,
  bio,
  role,
  created_at,
  register_mode,
  register_step,
  available,
  show_email
`;

export async function validateEmailPassword(email, plainPassword) {
  const userPassRes = await db.oneOrNone(`
    SELECT pass_digest from users
    WHERE
      email = $1 AND
      register_step = 'registered' AND
      register_mode = 'email'`, email);

  if (!userPassRes) {
    throw (new Error('email_does_not_exists'));
  }

  if ((await comparePwd(plainPassword, userPassRes.pass_digest)) === false) {
    throw (new Error('wrong_password'));
  }

  const user = await db.one(`
    SELECT ${userSessionFields} from users
    WHERE email = $1`, email);

  return user;
}

export async function updateUserPassword(email, oldPassword, newPassword) {
  const userValid = await validateEmailPassword(email, oldPassword);

  const digest = await digestPassword(newPassword);

  await db.none(`
    UPDATE users SET pass_digest = $1
    WHERE id = $2`, [
      digest,
      userValid.id,
    ]);
}

export async function setUserPassword(id, password) {
  const digest = await digestPassword(password);

  return await db.none(`
    UPDATE users SET pass_digest = $1
    WHERE id = $2`, [
      digest,
      id,
    ]);
}

export async function loadSessionUser(userId, registerStep) {
  return await db.oneOrNone(`
    SELECT ${userSessionFields}
    FROM users
    WHERE
    id=$1 AND register_step=$2`, [
      userId,
      registerStep,
    ]);
}

export async function loadUserSocialProfiles(userId) {
  const socialProfiles = await db.oneOrNone(`
    SELECT website, facebook, twitter
    FROM user_social_networks
    WHERE user_id = $1`,
    userId);
  return socialProfiles;
}

export async function loadUserByEmail(email) {
  const user = await db.oneOrNone(`
    SELECT ${userSessionFields} from users
    WHERE email = $1`, email);
  return user;
}

export async function loadRegisteredUserByEmail(email) {
  const user = await db.oneOrNone(`
    SELECT ${userSessionFields} from users
    WHERE email = $1 AND register_step = 'registered'`, email);
  return user;
}

export async function getPasswordResetTokenByEmail(email, token) {
  return await db.oneOrNone(`
    SELECT pass_reset.* FROM user_password_reset pass_reset
    JOIN users usr ON pass_reset.user_id = usr.id
    WHERE usr.email = $1 AND token = $2`, [
      email,
      token,
    ]);
}

export async function invalidateToken(tokenId) {
  return await db.none(`
    UPDATE user_password_reset SET used = true
    WHERE id = $1`, tokenId);
}
