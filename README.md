# Idea

The idea behind this tool is that you can download a Liferay page with JS portlets and remvoing the initialisation. \
It prepares a Liferay page for webpack.

``npx lfr-js-portlet-bootstrapper``

or

``npx lfr-js-portlet-bootstrapper liferay.portlet.config.js``

# What does it?
It generates a **public** folder with the following content:
- **index.html** (Indexpage for Webpack)
- **parameters.json** (data all JS portlet calls)

# How it works
It scans for the following attribute on a HTML-tag:
1. If the script finds selector it copies the **id** and generates a json file.

# Development with Webpack (Recommended)

## Why Webpack and not Liferay Blade Deploy?
There are some drawbacks with the Liferay development and Vue. When you use the webpack you work around this problems.

The mains advantages are:
1. No caching
1. Build needs 1 sec
1. Hotreload (reloads the page when build is finished)
1. Vue Devtools are working
1. Good Errormessages

## How to set it up
1. create a **liferay.portlet.config.js** in the root of the module.
1. Add ``auth.token.check.enabled=false`` to the portal-ext.properties
1. Configure your http to redirect to webpack


### Example for liferay.portal.config.js
````
module.exports = {
  protocol: 'http',
  host: 'localhost',
  originPort: 8080,
  port: 3000,
  remove: {
    script: [],
    selector: '[id^=js-portlet-] + script'
  },
  initCall: {
    selector: '[id^=js-portlet-] + script',
    id: 'portletElementId'
  }
}
````

## How to update your index.html
``npx liferay-js-portlet-bootstrapper``

or

``npx liferay-js-portlet-bootstrapper liferay.portlet.config.js``