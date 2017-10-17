import Router from 'koa-router';
import { renderPage } from '../util';

const router = new Router();

router
  .get('/error', renderPage('error'))
  .get('/*', renderPage('notFound'));

export default router;
