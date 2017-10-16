import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  avatar: { type: String },
  twitter: { type: String },
  blog: { type: String },
  email: { type: String },
  github: { type: String },
  trello: { type: String },

  team: { type: Boolean },
  core: { type: Boolean },

  translator: { type: Boolean },
  editor: { type: Boolean },
  developer: { type: Boolean },
  author: { type: Boolean },

  salary: { type: Number },
});

const User = mongoose.model('users', UserSchema);
export default User;
