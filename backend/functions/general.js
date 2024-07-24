const shortid = require('shortid');
const validator = require('validator');
const axios = require('axios');

const isValidUrl = (url) => {
  return validator.isURL(url);
};

const isReachableUrl = async (url) => {
  try {
    const response = await axios.get(url);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
};

const generateShortId = async (Url) => {
  let short;
  while (true) {
    short = shortid.generate();
    const existingUrl = await Url.findOne({ short });
    if (!existingUrl) break;
  }
  return short;
};

module.exports = {
  isValidUrl,
  isReachableUrl,
  generateShortId
};