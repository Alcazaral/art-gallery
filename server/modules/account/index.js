import Router from 'koa-router';
import updateProfile from './endpoint/updateProfile';
import updateProfileSchema from './endpoint/updateProfileSchema';
import editPassword from './endpoint/editPassword';
import editPasswordSchema from './endpoint/editPasswordSchema';
import editSocialProfiles from './endpoint/editSocialProfiles';
import updateProfileImage from './endpoint/updateProfileImage';
import removeProfileImage from './endpoint/removeProfileImage';
import deleteAccount from './endpoint/deleteAccount';
import { renderPage } from '../util';

const router = new Router();

router

  .get('/account', renderPage('account'))
  .get('/account/social-profiles', renderPage('account/social-profiles'))
  .get('/account/password', renderPage('account/password'))

  .post('/api/account/edit-profile', updateProfileSchema, updateProfile)
  .post('/api/account/edit-social-profiles', editSocialProfiles)
  .post('/api/account/update-profile-image', updateProfileImage)
  .post('/api/account/remove-profile-image', removeProfileImage)
  .post('/api/account/edit-password', editPasswordSchema, editPassword)
  .post('/api/account/delete-account', deleteAccount);

export default router;
