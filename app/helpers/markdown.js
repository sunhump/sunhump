// Creates a {{markdown}} tag

var marked = require('marked');

module.exports = function(text) {
  return marked(text);
}