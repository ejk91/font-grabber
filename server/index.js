const express = require('express');
const bodyParser = require('body-parser');
const scrape = require('website-scraper');
const fontFetcher = require('./helpers/fetchFontHelpers.js');
const http = require('http')

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

let port = 3000;
exports.server = app;
app.listen(port, () => {
  console.log(`Font Fetcher listening on port ${port}!`)
})