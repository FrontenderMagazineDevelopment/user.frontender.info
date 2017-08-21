const MongoClient = require('mongodb').MongoClient;

const COLLECTION_NAME = 'users';

export default class Users {

  constructor(url) {
    this.url = url;
  }

  async connect() {
    this.db = await MongoClient.connect(this.url);
    this.cl = this.db.collection(COLLECTION_NAME);
  }

  getUser(id) {

  }

  replaceUser(id) {

  }

  updateUser(id) {

  }

  deleteUser(id) {

  }

  async createUser(user) {
    const result = await this.cl.insertOne(user);
    return result.ops[0];
  }

  async getUsers() {
    const result = await this.cl.find().toArray();
    return result;
  }

  ifInGroup() {

  }

  ifOwner() {

  }

}
