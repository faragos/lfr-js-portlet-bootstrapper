var fs = require('fs')
var preparePage = require('./preparePage')
var request = require('request')

module.exports = function (configPath, basePath) {
  const folderName = basePath + '/.webpack/'

  let config = getConfig(configPath, basePath)

  config.url = config.protocol + '://' + config.host + ':' + config.originPort
  config.directory = folderName

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }

  try {
    downloadPage(config).then(() => {

    })
  } catch (err) {
    console.error(err)
  }
}

module.exports.getIndexPath = function () {
  return __dirname + '/.webpack/index.html'
}

module.exports.getPropsElements = function () {
  return require(__dirname + '/.webpack/parameters.json')
}

async function downloadPage (options) {
  request({
    uri: options.url,
  }, function (error, response, body) {
    preparePage(options, body)
  })
}

function getConfig (configPath, basePath) {
  if (!configPath) {
    configPath = 'liferay.portlet.config.js'
  }

  let fullConfigPath = basePath + '/' + configPath

  if (!fs.existsSync(fullConfigPath)) {
    console.info(fullConfigPath + ' not Found')
    console.info('using config from ./' + configPath)
    return require(__dirname + '/' + configPath)
  }

  return require(fullConfigPath)
}







