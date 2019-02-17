import joi from 'joi';

export default {
  body: joi
    .object()
    .keys({
      name: joi.string(),

      avatar: joi.string().uri(),
      twitter: joi.string(),
      github: joi.string(),
      blog: joi.string().uri(),
      email: joi.string().email(),
      trello: joi.string(),

      team: joi.boolean(),
      core: joi.boolean(),

      translator: joi.boolean(),
      editor: joi.boolean(),
      developer: joi.boolean(),
      author: joi.boolean(),

      salary: joi.number(),

      _id: joi.string().required(),
      __v: joi.number(),
    })
    .required(),
};
