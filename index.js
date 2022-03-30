var fs = require('fs')
var preparePage = require('./preparePage')
const fetch = require('node-fetch')

module.exports = async function (configPath, basePath) {
  const folderName = basePath + '/.webpack/'

  let config = getConfig(configPath, basePath)

  config.url = config.protocol + '://' + config.host + ':' + config.originPort + (config.url ? config.url : '')
  config.directory = folderName

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }

  try {
    await downloadPage(config)
    console.info('Downloading page finished')
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
  let headers = {}
  if (options.user && options.password) {
    headers = { 'Authorization': `Basic ${Buffer.from(options.user + ':' + options.password).toString('base64')}` }
  }
  let res = await fetch(options.url, { headers })
  let body = await res.text()
  return preparePage(options, body)
}

function getConfig (configPath, basePath) {
  if (!configPath) {
    configPath = 'liferay.portlet.config.js'
  }

  let fullConfigPath = basePath + '/' + configPath

  let finalConfig
  const defaultConfig = require(__dirname + '/' + configPath)
  if (fs.existsSync(fullConfigPath)) {
    const userConfig = require(fullConfigPath)
    finalConfig = {...defaultConfig, ...userConfig}
  } else {
    console.info(fullConfigPath + ' not Found')
    console.info('using config from ./' + configPath)
    finalConfig = defaultConfig
  }

  return finalConfig
}







