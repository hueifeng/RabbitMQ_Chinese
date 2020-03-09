var cheerio = require('cheerio');

var BookPage = require('./BookPage');
var PageHeader = require('./PageHeader');

var Headers = function () {
    this.maxLevel = 2;
    this.pages = [];
};
Headers.prototype.buildSelector = function () {
    var selector = 'h1';
    for (var i = 2; i <= Math.min(this.maxLevel, 6); i++) {
        selector += ', h' + i;
    }
    return selector;
};
Headers.prototype.sortPages = function () {
    this.pages.sort(function (left, right) {
        return left.index - right.index;
    });
};
Headers.prototype.configure = function (config, log) {
    if (typeof config == 'object') {
        if (typeof config.levels == 'number') {
            if (config.levels < 1 || config.levels > 6) {
                if (typeof log !== 'undefined') {
                    log.warn('Bad header level ', config.levels, ', must be between 1 and 6');
                }
            } else {
                this.maxLevel = config.levels;
            }
        }
        if (typeof config.idGenerator == 'function') {
            this.idGenerator = config.idGenerator;
        }
    }
};
Headers.prototype.idForText = function (text) {
    if (this.idGenerator !== undefined) {
        return this.idGenerator(text);
    } else {
        return text.replace(/\W+/g, '-').replace(/^\-*(.*?)\-*$/g, '$1').toLowerCase();
    }
};
Headers.prototype.identify = function (header) {
    var id = header.attr('id');
    if (id == undefined) {
        var txt = header.text();
        id = this.idForText(txt);
        header.attr('id', id);
    }

};
Headers.prototype.sanitizeLevels = function () {
    this.pages.forEach(function (page) {
        page.sanitizeLevels();
    });
};
Headers.prototype.linkHeaders = function (html, path, pageIndex) {
    var that = this;
    var $ = cheerio.load(html);
    var selector = that.buildSelector();
    var headers = $(selector);
    var bookPage = new BookPage(path, pageIndex);
    this.pages.push(bookPage);
    headers.each(function (index, elem) {
        var header = $(elem);
        that.identify(header);
        bookPage.headers.push(new PageHeader(header));
    });
    return $.html();
};

module.exports = Headers;