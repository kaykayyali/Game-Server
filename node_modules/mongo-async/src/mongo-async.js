import mongodb from 'mongodb';
import Bluebird from 'bluebird';

Bluebird.promisifyAll(mongodb);

export default class MongoAsync {

  _instances = {};

  async connect(arg) {
    let url, name;

    if(typeof arg === 'string') {
      url = arg;
      name = 'default';
    }
    else {
      url = arg.url;
      name = arg.name || 'default';
    }

    this._instances[name] = await mongodb.connectAsync(url);
    return this._instances[name];
  }

  async db(connection = 'default') {
    if(!this._instances[connection])
      throw new Error('Not connected to database ' + connection);

    return this._instances[connection];
  }

  async collection(name, connection) {
    let db = await this.db(connection);
    return db.collection(name);
  }
};