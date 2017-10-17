import Router from 'koa-router';
import renderGallery from './endpoint/renderGallery';
import loadShots from './endpoint/loadShots';
import loadShotsSchema from './endpoint/loadShotsSchema';

const router = new Router();

router
  .post('api/gallery/load-shots', loadShotsSchema, loadShots)
  .get('', renderGallery);

export default router;
