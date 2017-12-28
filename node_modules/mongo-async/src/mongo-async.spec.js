import sinon from 'sinon';
import chai from 'chai';
import mongodb from 'mongodb';
import MongoAsync from './mongo-async';

let expect = chai.expect;

describe('mongo-async', () => {
  let mongo;

  beforeEach(() => {
    mongo = new MongoAsync();
    sinon.stub(mongodb, 'connectAsync');
  });

  afterEach(() => {
    mongodb.connectAsync.restore();
  });

  describe('#connect', () => {
    beforeEach(() => {
      mongodb.connectAsync.returns('connected');
    });
    describe('when argument is a string', () => {
      it('should use the argument as the url', (next) => {
        mongo
          .connect('test')
          .then(() => expect(mongodb.connectAsync.args[0][0]).to.equal('test'))
          .then(() => next())
          .catch(next);
      });
      it('should use default as the instance name', async (next) => {
        mongo
          .connect('test')
          .then(() => expect(mongo._instances['default']).to.equal('connected'))
          .then(() => next())
          .catch(next);
      });
    });
    describe('when argument is an object', () => {
      it('should use the url property', (next) => {
        mongo
          .connect({ url: 'test' })
          .then(() => expect(mongodb.connectAsync.args[0][0]).to.equal('test'))
          .then(() => next())
          .catch(next);
      });
      describe('when name property supplied', () => {
        it('should use the name as the instance', (next) => {
          mongo
            .connect({ url: 'test', name: 'instance' })
            .then(() => expect(mongo._instances['instance']).to.equal('connected'))
            .then(() => next())
            .catch(next);
        });
      });
      describe('when name property not supplied', () => {
        it('should use the default instance', (next) => {
          mongo
            .connect({ url: 'test' })
            .then(() => expect(mongo._instances['default']).to.equal('connected'))
            .then(() => next())
            .catch(next);
        });
      });
    });
  });

  describe('#db', () => {
    describe('when no argument', () => {
      it('should return the default instance', (next) => {
        mongo._instances['default'] = 'connected';
        mongo
          .db()
          .then((db) => expect(db).to.equal('connected'))
          .then(() => next())
          .catch(next);
      });
    });
    describe('when name argument supplied', () => {
      it('should return the instance with that name', (next) => {
        mongo._instances['named'] = 'connected';
        mongo
          .db('named')
          .then((db) => expect(db).to.equal('connected'))
          .then(() => next())
          .catch(next);
      });
    });
    describe('when instance doesnt exist', () => {
      it('should throw an execption', (next) => {
        mongo
          .db('named')
          .then(() => { throw new Error('Should not get here'); })
          .catch((err) => expect(err.message).to.equal('Not connected to database named'))
          .then(() => next())
          .catch(next);
      });
    });
  });

  describe('#collection', () => {
    describe('when connection doesnt exist', () => {
      it('should throw an exception', (next) => {
        mongo
          .collection('items')
          .then(() => { throw new Error('Should not get here'); })
          .catch((err) => expect(err.message).to.equal('Not connected to database default'))
          .then(() => next())
          .catch(next);
      });
    });
    describe('when no connection supplied', () => {
      it('should use default connection', (next) => {
        let db = { collection: sinon.stub() };
        mongo._instances['default'] = db;
        mongo
          .collection('items')
          .then(() => expect(db.collection.args[0][0]).to.equal('items'))
          .then(() => next())
          .catch(next);
      });
    });
    describe('when named connection used', () => {
      it('should use the named connection', (next) => {
        let db = { collection: sinon.stub() };
        mongo._instances['named'] = db;
        mongo
          .collection('items', 'named')
          .then(() => expect(db.collection.args[0][0]).to.equal('items'))
          .then(() => next())
          .catch(next);
      });
    });
    it('it should return the collection', (next) => {
      let db = { collection: sinon.stub().returns('items') };
        mongo._instances['default'] = db;
        mongo
          .collection('items')
          .then((collection) => expect(collection).to.equal('items'))
          .then(() => next())
          .catch(next);
    });
  });
});