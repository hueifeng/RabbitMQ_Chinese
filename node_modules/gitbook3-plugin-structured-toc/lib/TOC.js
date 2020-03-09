var relative = require('relative');
var cheerio = require('cheerio');

var TOC = function () {
};

TOC.prototype.link = function (headerInfo, sourcePath, targetPath, addAnchor) {
    return relative(sourcePath, targetPath)
           + (addAnchor ? '#' + headerInfo.anchor : '');
};

TOC.prototype.generate = function (headers, sourcePath) {
    var $ = cheerio.load('<div />');
    var root = $('div');
    var lastNode = root;
    var lastLevel = 0;
    var that = this;
    headers.pages.forEach(
        function (page) {
            var path = page.path;
            page.headers.forEach(
                function (headerInfo, index) {
                    var level = headerInfo.level;
                    if (level > lastLevel) {
                        lastNode.append('<ol><li/></ol>');
                    } else if (level < lastLevel) {
                        lastNode.parent().parent().after('<li/>');
                    } else {
                        lastNode.after('<li />');
                    }
                    lastNode = root.find('ol li').last();
                    lastLevel = level;
                    lastNode.append('<a href="' + that.link(headerInfo, sourcePath, path, index > 0)
                                    + '">'
                                    + headerInfo.content + '</a>');
                });
        }
    );
    return root.html();
};

module.exports = TOC;