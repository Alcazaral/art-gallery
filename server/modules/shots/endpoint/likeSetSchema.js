
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    shotId: Joi.number().integer().required(),
    shotUrl: Joi.string().required(),
    liked: Joi.boolean().required(),
  }),
});
