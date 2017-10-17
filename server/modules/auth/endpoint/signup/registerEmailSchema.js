
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    password: Joi.string().min(6).max(30).required(),
    email: Joi.string().email().min(6).max(30),
  }),
});
