
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    shotImg: Joi.string().required(),
    attachmentsImgs: Joi.array().items(Joi.string()),
    title: Joi.string().required(),
    game: Joi.number().integer().required(),
    army: Joi.number().integer().required(),
    description: Joi.string(),
  }),
});
