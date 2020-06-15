const cheerio = require('cheerio')
let fs = require('fs');
var syncrequest = require('sync-request');

module.exports = function(options, body) {
    let filename = options.directory + 'index.html';
    const $ = cheerio.load(body);
    let jsPortlets = [];

    loadInline($, options)

    if(options.initCall && options.initCall.selector) {
        $(options.initCall.selector).each(function() {
            let scriptContent = $(this).html()
            let paramsStr = findParams(scriptContent)
            paramsStr = removeTabs(paramsStr)
            paramsStr = removeLinebreaks(paramsStr)
            eval("config=" + paramsStr)
            let component = new JsPortlet(config[options.initCall.id], JSON.stringify(config))
            jsPortlets.push(component)
        });
    }

    removeParts($, options)

    let text = $.html();

    let json = JSON.stringify(jsPortlets);
    fs.writeFileSync(options.directory + 'parameters.json', json, 'utf8');
    fs.writeFileSync(filename, text, 'utf8');
}

function loadInline ($, options) {
    if(options.loadInline && options.loadInline.selector) {
        let scriptTag = $(options.loadInline.selector).eq(0)
        let path = scriptTag.attr('src')
        let res = syncrequest("GET", path)
        let newScripttag = `<script>${res.getBody()}</script>`
        scriptTag.replaceWith(newScripttag)
    }
}

function removeParts ($, options) {
    if(options.remove && options.remove.selector) {
        console.log("Following tags got removed:")
        $(options.remove.selector).each(function(i, elm) {
            console.log((i + 1) + ". line")
            console.log("----------------------")
            console.log($.html(this).trim())
            console.log("----------------------\n")
        });

        $(options.remove.selector).remove();
    }
}

function findParams(content) {
    let initText = 'initializer('
    let initStart = content.indexOf(initText) + initText.length;
    if (initStart > 0) {
        let initEnd = findClosingBracketMatchIndex(content,initStart - 1)
        if (initEnd > 0) {
            return content.substring(initStart, initEnd)
        }
    }
    return false
}

function removeTabs (params) {
    return String(params).replace(/\t/g,'')
}

function removeLinebreaks (params) {
    return String(params).replace(/\n/g,'')
}

function findClosingBracketMatchIndex(str, pos) {
    if (str[pos] != '(') {
        throw new Error("No '(' at index " + pos);
    }
    let depth = 1;
    for (let i = pos + 1; i < str.length; i++) {
        switch (str[i]) {
            case '(':
                depth++;
                break;
            case ')':
                if (--depth == 0) {
                    return i;
                }
                break;
        }
    }
    return -1;    // No matching closing parenthesis
}

function JsPortlet (id, content) {
    this.id = id;
    this.content = content;
}