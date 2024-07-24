const assert = require('assert');
const { isValidUrl, isReachableUrl, generateShortId } = require('../../functions/general');
const mongoose = require('mongoose');
const shortid = require('shortid');
const sinon = require('sinon');
const axios = require('axios');

const Schema = mongoose.Schema;
const urlSchema = new Schema({
  url: String,
  short: String
});
const Url = mongoose.model('urls', urlSchema);

describe('General Functions', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/ntsal-internship-test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterEach(async () => {
    await Url.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('isValidUrl', () => {
    it('should return true for a valid URL', () => {
      const url = 'http://www.example.com';
      assert.strictEqual(isValidUrl(url), true);
    });

    it('should return false for an invalid URL', () => {
      const url = 'invalid-url';
      assert.strictEqual(isValidUrl(url), false);
    });
  });

  describe('isReachableUrl', () => {
    it('should return true for a reachable URL', async () => {
      const url = 'http://www.example.com';
      const stub = sinon.stub(axios, 'get').resolves({ status: 200 });
      const result = await isReachableUrl(url);
      assert.strictEqual(result, true);
      stub.restore();
    });

    it('should return false for a non-reachable URL', async () => {
      const url = 'http://nonexistent-ddvrfheihfciew.example.com';
      const stub = sinon.stub(axios, 'get').rejects(new Error('Network Error'));
      const result = await isReachableUrl(url);
      assert.strictEqual(result, false);
      stub.restore();
    });
  });

  describe('generateShortId', () => {
    it('should generate a unique short ID', async () => {
      const stub = sinon.stub(shortid, 'generate').returns('uniqueID');
      const findOneStub = sinon.stub(Url, 'findOne').resolves(null);
      const short = await generateShortId(Url);
      assert.strictEqual(short, 'uniqueID');
      stub.restore();
      findOneStub.restore();
    });
  });
});
