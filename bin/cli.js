#!/usr/bin/env node

var main = require('../index')
const args = process.argv.slice(2)
var config = args[0];

main(config, process.cwd())