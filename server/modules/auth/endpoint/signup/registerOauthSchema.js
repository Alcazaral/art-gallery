
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    provider: Joi
      .string()
      .valid(['twitter', 'facebook', 'google'])
      .required(),
    code: Joi
      .alternatives().try(
        Joi.object().keys({
          oauth_token: Joi.string(),
          oauth_verifier: Joi.string(),
        }),
        Joi.string())
      .required(),
  }),
});
