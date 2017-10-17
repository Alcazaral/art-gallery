
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  params: Joi.object().keys({
    email: Joi
      .string().email().min(6).max(30)
      .required(),
    validationToken: Joi.string().required(),
  }),
});
