const fs = require('fs');


exports.grabFileNames = (path) => {
  return grabCSSFilenames(path)
    .then((CSS) => {
      return grabHTMLFilenames(path, CSS)
    })
}

const grabCSSFilenames = (path) => {
  return new Promise((resolve, reject) => {
    let cssPath = `${path}/css`;
    fs.readdir(cssPath, (err, files) => {
      result = files || []; // return empty array if no CSS files are present
      resolve(result);
    })
  }) 
}

const grabHTMLFilenames = (path, data) => {
  return new Promise((resolve, reject) => {
    const result = data;
    fs.readdir(path, (err, files) =>{
      let count = 0;
      files.forEach((file) => { //filter out non-html files
        count++
        if (file.includes('.html')) { 
          result.push(file)
        }
        if (count === files.length) {
          resolve(result)
        }
      })
    })
  })
}

exports.grabFontsFromFiles = (files , path) => {
  return new Promise((res, rej) => {
    let result = {}
    result['css'] = {}
    result['html'] = {}

    // Array of promises - each reads data and stores found fonts in result
    let promiseFiles = files.map((file) => {
      return new Promise((resolve, reject) => {
        let fonts;
        if (file.includes('.css')) { // For css files
          fs.readFile(`${path}/css/${file}`, {encoding: 'utf8'}, (err, data) => {
            if (err) {
              console.log('***', err)
            } else {
              grabFonts(data, 'css')
                .then((fonts) => {
                  if (fonts.length > 0) {
                    result['css'][file] = fonts
                  }
                  resolve()
                })
                .catch((err) => {
                  throw err;
                })
            }
          })
        } else { // For HTML files
          fs.readFile(`${path}/${file}`, {encoding: 'utf8'}, (err, data) => {
            if (err) {
              console.log('***', err)

            } else {
              grabFonts(data, 'html')
                .then((fonts) => {
                  if (fonts.length > 0) {
                    result['html'][file] = fonts
                  }
                  resolve()
                })
                .catch((err) => {
                  throw err;
                })
            }
          })
        }
      })
    })

  Promise.all(promiseFiles)
    .then((files) => {
      res(result)
    }).catch((err) => {
      console.log('---', err)
    })
  })
}

//Filters file and grabs font-family
const grabFonts = (data, option) => {
  return new Promise((resolve, reject) => {
    const result = [];

    const regexCSS = /font-family:(.*?);/g
    const regexHTML = /font-family:(.*?)}/g

    // Hash map to avoid duplicate font families
    const storage = {}

    let regex;
    let match;

    if (option === 'html') {
      regex = regexHTML;
    } else if (option === 'css') {
      regex = regexCSS;
    }

    match = regex.exec(data)
    while(match !== null) {
      if (!storage[match[1]]){ // avoid duplicates
        result.push(match[1]);
        storage[match[1]] = true;
      }
      match = regex.exec(data) 
    }
    resolve(result);
  })
}