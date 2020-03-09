var BookPage = function (path, index) {
    this.path = path;
    this.headers = [];
    this.index = index;
};
BookPage.prototype.sanitizeLevels = function () {
    var current = 0;
    this.headers.forEach(function (header) {
        header.level = Math.min(header.level, current + 1);
        current = header.level;
    });
};
module.exports = BookPage;