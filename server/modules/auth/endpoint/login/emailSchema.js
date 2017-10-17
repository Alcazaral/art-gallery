
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    email: Joi.string().email().min(6).max(30)
      .required(),
    password: Joi.string().min(6).max(30)
      .required(),
  }),
});
