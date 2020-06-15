var fs = require('fs');
var preparePage = require("./preparePage")
var request = require("request");

module.exports = function (configPath, basePath) {
    const folderName = basePath + '/.webpack/';

    if(!configPath) {
      configPath = 'liferay.portlet.config.js'
    }

    let fullConfigPath = basePath + '/' + configPath

    if(!fs.existsSync(fullConfigPath)) {
      console.error(configPath + ' not Found')
      return
    }

    let config = require(fullConfigPath);

    config.url = config.protocol + '://' + config.host + ':' + config.originPort
    config.directory = folderName

    if (!fs.existsSync(folderName)){
      fs.mkdirSync(folderName);
    }

    try {
      downloadPage(config).then(() => {

      })
    } catch (err) {
        console.error(err)
    }
}

module.exports.getIndexPath = function() {
  return __dirname + '/.webpack/index.html';
}

module.exports.getPropsElements = function() {
  return require(__dirname + '/.webpack/props.json');
}

async function downloadPage (options) {
  request({
    uri: options.url,
  }, function(error, response, body) {
    preparePage(options, body);
  });
}










