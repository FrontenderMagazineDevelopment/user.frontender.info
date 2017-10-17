import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, text : true },

  avatar: { type: String, default: null },
  twitter: { type: String, default: null },
  blog: { type: String, default: null },
  email: { type: String, default: null },
  github: { type: String, default: null },
  trello: { type: String, default: null },

  team: { type: Boolean, default: false },
  core: { type: Boolean, default: false },

  translator: { type: Boolean, default: false },
  editor: { type: Boolean, default: false },
  developer: { type: Boolean, default: false },
  author: { type: Boolean, default: false },

  salary: { type: Number, default: null },
});

const User = mongoose.model('users', UserSchema);
export default User;
