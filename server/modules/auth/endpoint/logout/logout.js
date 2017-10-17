
export default async function signOut(ctx) {
  ctx.cookies.set('token', '', { expires: new Date(1), path: '/' });
  ctx.response.status = 200;
}
