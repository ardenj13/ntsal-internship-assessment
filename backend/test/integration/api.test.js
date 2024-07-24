require('dotenv').config();
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index'); // Adjust path as necessary
const { generateShortId } = require('../../functions/general'); // Adjust path as necessary

const TEST_MONGODB_URI = process.env.TEST_DATBAASE;
const Url = mongoose.model('urls');

describe('URL Shortener API', () => {
  before(async () => {
    // Disconnect from any existing connection (likely the production database)
    await mongoose.disconnect();

    // Connect to the test database
    await mongoose.connect(TEST_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterEach(async () => {
    // Clear all data after each test
    await Url.deleteMany({});
  });

  after(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  describe('POST /shorten', () => {
    it('should shorten a valid URL and add it to the database', async () => {
      const url = 'http://www.example.com';
      const response = await request(app)
        .post('/shorten')
        .send({ url })
        .expect(200);

      assert(response.body.originalUrl === url);
      assert(response.body.shortUrl.includes('/'));

      // Extract the short ID from the shortUrl
      const shortId = response.body.shortUrl.split('/').pop();

      // Check if the URL was added to the database
      const savedUrl = await Url.findOne({ short: shortId });
      assert(savedUrl, 'URL was not found in the database');
      assert(savedUrl.url === url, 'Saved URL does not match the original URL');
      assert(savedUrl.short === shortId, 'Saved short ID does not match the returned short ID');
    });

    it('should return an error for an invalid URL', (done) => {
      const url = 'invalid-url';
      request(app)
        .post('/shorten')
        .send({ url })
        .expect(400)
        .expect((res) => {
          assert(res.body.error === 'Invalid URL');
        })
        .end(done);
    });

    it('should return an error for a non-reachable URL', (done) => {
      const url = 'http://nonexistent.example.com';
      request(app)
        .post('/shorten')
        .send({ url })
        .expect(400)
        .expect((res) => {
          assert(res.body.error === 'URL is not reachable');
        })
        .end(done);
    });
  });

  describe('GET /:id', () => {
    it('should redirect to the original URL', async () => {
      const url = 'http://www.example.com';
      const short = await generateShortId(Url);
      const urlDoc = new Url({ url, short });
      await urlDoc.save();

      await request(app)
        .get(`/${short}`)
        .expect(302)
        .expect('Location', url);

      const updatedUrlDoc = await Url.findOne({ short });
      assert(updatedUrlDoc.views === 1, 'Views should be incremented to 1');

      await request(app)
        .get(`/${short}`)
        .expect(302)
        .expect('Location', url);

      const finalUrlDoc = await Url.findOne({ short });
      assert(finalUrlDoc.views === 2, 'Views should be incremented to 2');
    });

    it('should return 404 for a non-existent shortened ID', async () => {
      await request(app)
        .get('/nonexistent')
        .expect(404)
        .expect((res) => {
          assert(res.body === 'URL not found');
        });
    });
  });

  describe('GET /fetch/urls', () => {
    it('should fetch all shortened URLs', async () => {
      const url1 = new Url({ url: 'http://example1.com', short: await generateShortId(Url) });
      const url2 = new Url({ url: 'http://example2.com', short: await generateShortId(Url) });
      await url1.save();
      await url2.save();

      const response = await request(app)
        .get('/fetch/urls')
        .expect(200);

      assert(Array.isArray(response.body));
      assert(response.body.length === 2);
      assert(response.body.some(item => item.url === 'http://example1.com'));
      assert(response.body.some(item => item.url === 'http://example2.com'));
    });
  });

  describe('PUT /:id', () => {
    it('should update the original URL and reflect changes in the database', async () => {
      // First, create a URL to update
      const originalUrl = 'http://example.com';
      const short = await generateShortId(Url);
      const urlDoc = new Url({ url: originalUrl, short });
      await urlDoc.save();

      // Now, update the URL
      const newUrl = 'http://newexample.com';
      const response = await request(app)
        .put(`/${short}`)
        .send({ url: newUrl })
        .expect(200);

      assert(response.body.message === 'URL updated successfully');
      assert(response.body.updatedUrl.url === newUrl);

      // Check if the URL was updated in the database
      const updatedUrlDoc = await Url.findOne({ short });
      assert(updatedUrlDoc, 'URL document not found in the database');
      assert(updatedUrlDoc.url === newUrl, 'URL in database does not match the updated URL');
      assert(updatedUrlDoc.short === short, 'Short ID in database does not match the original short ID');

      // Ensure no additional documents were created
      const urlCount = await Url.countDocuments();
      assert(urlCount === 1, 'Update operation should not create new documents');
    });

    it('should return 404 for a non-existent shortened ID', async () => {
      await request(app)
        .put('/nonexistent')
        .send({ url: 'http://newexample.com' })
        .expect(404)
        .expect((res) => {
          assert(res.body.error === 'Shortened ID not found');
        });
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a shortened URL', async () => {
      const short = await generateShortId(Url);
      const urlDoc = new Url({ url: 'http://example.com', short });
      await urlDoc.save();

      await request(app)
        .delete(`/${short}`)
        .expect(200)
        .expect((res) => {
          assert(res.body.message === 'URL deleted successfully');
        });

      const deletedUrl = await Url.findOne({ short });
      assert(!deletedUrl);
    });

    it('should return 404 for a non-existent shortened ID', async () => {
      await request(app)
        .delete('/nonexistent')
        .expect(404)
        .expect((res) => {
          assert(res.body.error === 'Shortened ID not found');
        });
    });
  });
});