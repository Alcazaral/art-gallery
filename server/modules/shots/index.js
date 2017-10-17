import Router from 'koa-router';
import saveShot from './endpoint/saveShot';
import saveShotSchema from './endpoint/saveShotSchema';
import uploadShotImg from './endpoint/uploadShotImg';
import renderShotPage from './endpoint/renderShotPage';
import loadShot from './endpoint/loadShot';
import likeSet from './endpoint/likeSet';
import likeSetSchema from './endpoint/likeSetSchema';
import { renderPage /** authorizedApi **/ } from '../util';

const router = new Router();

router

  // TODO: Add authorization
  // router.use(authorizedApi);

  .get('/shots/new', renderPage('shots/new'))
  .get('/shots/shot/:shotUrl', renderShotPage)

  .post('/api/shots/load-shot', loadShot)
  .post('/api/shots/save-shot', saveShotSchema, saveShot)
  .post('/api/shots/upload-shot-image', uploadShotImg)
  .post('/api/shots/like-set', likeSetSchema, likeSet);

export default router;
