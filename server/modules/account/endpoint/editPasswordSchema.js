
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    oldPassword: Joi.string().min(6).max(30).required(),
    newPassword: Joi.string().min(6).max(30).required(),
  }),
});
