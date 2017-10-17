
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    gameId: Joi.alternatives().try(Joi.number(), Joi.any().allow(null)),
    armyId: Joi.alternatives().try(Joi.number(), Joi.any().allow(null)),
    time: Joi.number(),
    sort: Joi.string(),
    offset: Joi.number(),
    textSearch: Joi.string(),
  }),
});
