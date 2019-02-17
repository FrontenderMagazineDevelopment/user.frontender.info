import joi from 'joi';

export default {
  body: joi
    .object()
    .keys({
      name: joi.string().required(),

      avatar: joi.string().uri(),
      twitter: joi.string(),
      github: joi.when('team', {
        is: true,
        then: joi.string().required(),
        otherwise: joi.string(),
      }),
      blog: joi.string().uri(),
      email: joi.string().email(),
      trello: joi.string(),

      team: joi.boolean().default(false),
      core: joi.boolean().default(false),

      translator: joi.boolean().default(false),
      editor: joi.boolean().default(false),
      developer: joi.boolean().default(false),
      author: joi.boolean().default(false),

      salary: joi.number(),
    })
    .required(),
};
