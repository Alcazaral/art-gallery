import render from '../render';

const debug = require('debug')('app:server:modules:util');

export function redirect(url) {
  return async function redirectMiddleware(ctx) {
    ctx.redirect(url);
  };
}

export function renderPage(page, modalPage) {
  return async (ctx) => {
    if (page === 'notFound') ctx.response.status = 404;
    debug('rendering page', page,
      'with user', ctx.state.user ? ctx.state.user.username : 'anonimous');
    const state = { currentPage: page };
    if (modalPage) {
      state.modal = {
        show: true,
        page: modalPage,
        backgroundPage: page,
      };
    }
    await render({ state, ctx });
  };
}

export async function authorizedApi(ctx, next) {
  if (!ctx.state.user || !ctx.state.user.validated) {
    ctx.response.status = 401;
    ctx.response.body = '401 unathorized';
    return;
  }

  await next();
}

export async function authorizedRoute(ctx, next) {
  if (!ctx.state.user || !ctx.state.user.validated) {
    ctx.redirect('/');
    return;
  }

  await next();
}

// export function authorize(...allowed) {
//   return async (ctx, next) => {
//     let userType;

//     if (!ctx.state.user) {
//       userType = 'visitor';
//     } else if (!ctx.state.user.validated) {
//       userType = 'register';
//     } else {
//       userType = 'user';
//     }

//     if (allowed.includes(userType)) {
//       await next();
//     }
//   };
// }
