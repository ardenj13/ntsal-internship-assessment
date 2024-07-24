require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const { isValidUrl, isReachableUrl, generateShortId } = require('./functions/general');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/ntsal-internship', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const urlSchema = new mongoose.Schema({
  url: String,
  short: String,
  views: { type: Number, default: 0 }
});

const Url = mongoose.model('urls', urlSchema);

app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  let short;

  // Validate the URL
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Check if the URL is reachable
  if (!await isReachableUrl(url)) {
    return res.status(400).json({ error: 'URL is not reachable' });
  }
  
  // Generate a unique short ID
  short = await generateShortId(Url);

  const urlDoc = new Url({ url, short });
  try {
    // save the URL to the database
    await urlDoc.save();
    // append the short ID to the base URL
    const fullShortUrl = `${req.protocol}://${req.get('host')}/${short}`;
    res.json({ originalUrl: url, shortUrl: fullShortUrl });
  } catch (error) {
    console.error('Error saving URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const url = await Url.findOneAndUpdate(
    { short: id },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (url) {
    res.redirect(url.url);
  } else {
    res.status(404).json('URL not found');
  }
});

app.get('/fetch/urls', async (req, res) => {
  try {
    const urls = await Url.find({});
    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  // Validate the URL
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Check if the URL is reachable
  if (!await isReachableUrl(url)) {
    return res.status(400).json({ error: 'URL is not reachable' });
  }

  try {
    const updatedUrlDoc = await Url.findOneAndUpdate(
      { short: id },
      { url },
      { new: true }
    );

    if (updatedUrlDoc) {
      res.json({ message: 'URL updated successfully', updatedUrl: updatedUrlDoc });
    } else {
      res.status(404).json({ error: 'Shortened ID not found' });
    }
  } catch (error) {
    console.error('Error updating URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUrlDoc = await Url.findOneAndDelete({ short: id });

    if (deletedUrlDoc) {
      res.json({ message: 'URL deleted successfully', deletedUrl: deletedUrlDoc });
    } else {
      res.status(404).json({ error: 'Shortened ID not found' });
    }
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const connectDB = async (dbUrl) => {
  await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
};

if (require.main === module) {
  console.log('Connecting to MongoDB Atlas...');
  console.log('database:', process.env.PRODUCTION_DATABASE);
  const PROD_MONGODB_URI = process.env.PRODUCTION_DATABASE;
  connectDB(PROD_MONGODB_URI).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;