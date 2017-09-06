const express = require('express');
const bodyParser = require('body-parser');
const scrape = require('website-scraper');
const fontFetcher = require('./helpers/fetchFontHelpers.js');
const http = require('http')

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

//Route for URL
app.get('/url', (req, res) => {
  const url = req.query.url;
  const recurse= req.query.recursive === 'true' ? true : false;
  const maxRecDep = req.query.maxDepth || null;
  const filter = req.query.filter === 'true' ? true : false;
  const folderName = getFolderName(url); // Pathname for download

  console.log('Recieving Request for: ' + url);

  const options = {
    urls: [url],
    directory: `./websites/${folderName}`,
    sources: [
      {selector: 'link[rel="stylesheet"]', attr: 'href'},
      {selector: 'script', attr: 'src'}
    ],
    recursive: recurse,
    maxRecursiveDepth: maxRecDep
  }

  if (filter) {
    options['urlFilter'] = urlFilterFunc
  }


  scrape(options)
    .then((result) => {
      // Grab names of CSS and HTML Files
      return fontFetcher.grabFileNames(options.directory)
    })
    .then((files) => {
      // Grabs fonts from list of CSS and HTML Files
      return fontFetcher.grabFontsFromFiles(files, options.directory) })
    .then((results) => {
      res.status(200).send(JSON.stringify(results));
    })
    .catch((err) => {
      // If website was already downloaded
      fontFetcher.grabFileNames(options.directory)
      .then((files) => {
        return fontFetcher.grabFontsFromFiles(files, options.directory)
      })
      .then((results) =>{
        res.status(200).send(JSON.stringify(results));
      })
      .catch((err) => {
        res.status(418).send(JSON.stringify(err))
      })
    })
})


// filters input url for correct file path
const getFolderName = (url) => {
  const regexHTTP = /http:/
  if (url.match(regexHTTP)) {
    return url.slice(7)
  } else {
    return url.slice(8)
  }
}

// Filters out urls that are not from input url
const urlFilterFunc = (link) => {
  return link.indexOf(url) === 0
}

let port = 3000;
exports.server = app;
app.listen(port, () => {
  console.log(`Font Fetcher listening on port ${port}!`)
})