
import koaJoiBouncer from 'koa-joi-bouncer';

const Joi = koaJoiBouncer.Joi;

export default koaJoiBouncer.middleware({
  body: Joi.object().keys({
    username: Joi.string().min(6).max(30).required(),
    location: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    websiteUrl: Joi.string().allow(''),
    facebookUrl: Joi.string().allow(''),
    twitterUrl: Joi.string().allow(''),
    availableForPainting: Joi.boolean().required(),
    showEmail: Joi.boolean().required(),
  }),
});
