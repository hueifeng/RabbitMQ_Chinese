var PageHeader = function (header) {
    this.anchor = header.attr('id');
    this.level = parseInt(header.get(0).tagName.replace('h', ''));
    this.content = header.text();
};
module.exports = PageHeader;