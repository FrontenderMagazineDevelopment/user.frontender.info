import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, text : true },

  team: { type: Boolean, default: false },
  core: { type: Boolean, default: false },

  translator: { type: Boolean, default: false },
  editor: { type: Boolean, default: false },
  developer: { type: Boolean, default: false },
  author: { type: Boolean, default: false },

  salary: { type: Number, default: 0 },
});

const User = mongoose.model('users', UserSchema);
export default User;
