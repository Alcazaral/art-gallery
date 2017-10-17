import Koa from 'koa';
import convert from 'koa-convert';
import bodyParser from 'koa-better-body';
import koaBouncer from 'koa-bouncer';
import Router from 'koa-router';
import serve from 'koa-static';
import mount from 'koa-mount';
import webpack from 'webpack';
import path from 'path';
import webpackMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';

import authModuleRouter from './modules/auth';
import accountModuleRouter from './modules/account';
import appModuleRouter from './modules/app';
import shotsModuleRouter from './modules/shots';
import galleryModuleRouter from './modules/gallery';

import customValidationRules from './middleware/validationRules';
import decodeToken from './modules/auth/middleware/decodeToken';

import hostConfig from '../config/host';

const debug = require('debug')('app:server');

const ROOT_DIR = path.resolve(__dirname, '..');
const isDeveloping = process.env.NODE_ENV === 'development';

const app = new Koa();
const router = new Router();

console.log('ENV', process.env.NODE_ENV, isDeveloping);

// Add our custom rules to koaBouncer
customValidationRules(koaBouncer.Validator);

// Serve compiled client on development
if (isDeveloping) {
  const webpackClientDevelopmentConfig =
    require('../webpack_config/webpack.client.development.config');

  // create webpack compiler for the client APP
  const compiler = webpack(webpackClientDevelopmentConfig);

  // wrap the compiler in a a middleware that listen for changes and recompile
  // delays requests until compiled
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackClientDevelopmentConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  // Serve the compiled file
  app.use(convert(middleware));

  // Subscribe to changes and use webpack's HMR api
  // to hot reload the application
  app.use(convert(webpackHotMiddleware(compiler)));
}

// Serve the build folder
if (!isDeveloping) {
  app.use(convert(mount('/', serve(path.resolve(ROOT_DIR, 'build')))));
}

// Parse body and save it in ctx.request.body
app.use(convert(bodyParser({ fields: 'body' })));

// Public static files
app.use(convert(mount('/public', serve(path.resolve(ROOT_DIR, 'public')))));

// Decode token and save it in ctx.state.token
app.use(decodeToken());

app.use(async function catchUncaughtErrors(ctx, next) {
  try {
    await next();
  } catch (e) {
    console.log('ERROR: got bubbled error ', e.message, e.stack);
    ctx.response.status = 500;
    ctx.response.body = 'INTERNAL_ERROR';
    return;
  }
});

// Catch koa-joi-bouncer validation errors and format them
app.use(async function onValidationError(ctx, next) {
  try {
    debug('received query on route', ctx.request.path);
    await next();
  } catch (e) {
    if (!e.isJoi) {
      throw e;
    }

    if (ctx.request.method === 'GET') {
      debug('validation error on GET', ctx.request.url, e.details);
      ctx.redirect('/error');
      return;
    }

    const errorDetails = {};
    e.details.forEach((err) => {
      errorDetails[err.path] = {
        ...err,
      };
    });

    ctx.response.status = 400;
    ctx.response.body = errorDetails;
  }
});

// Auth module router
router.use(authModuleRouter.routes()).use(authModuleRouter.allowedMethods());

// Account module router
router.use(accountModuleRouter.routes())
  .use(accountModuleRouter.allowedMethods());

// Shots module
router.use(shotsModuleRouter.routes()).use(shotsModuleRouter.allowedMethods());

// Galery module router
router.use(galleryModuleRouter.routes())
  .use(galleryModuleRouter.allowedMethods());

// App module router, **set this after all other routes 404 is here**
router.use(appModuleRouter.routes()).use(appModuleRouter.allowedMethods());

// Server app router
app.use(router.routes()).use(router.allowedMethods());


app.listen(hostConfig.port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', hostConfig.port, hostConfig.port);
});
