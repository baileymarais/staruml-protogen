define(function (require, exports, module) {
    "use strict";

    function Generator(indentString) {
      this.lines = [];
      this.indentations = [];
      this.indentString = (indentString ? indentString : '\t'); // default tab
    }

    Generator.prototype.indent = function() {
      this.indentations.push(this.indentString);
    }

    Generator.prototype.outdent = function() {
      this.indentations.pop();
    }

    Generator.prototype.writeLine = function(data) {
      var line = (data ? data : '');
      this.lines.push(this.indentations.join('') + line);
    }

    Generator.prototype.write = function(data) {
      if (data) {
        if (this.lines.length == 0) { this.writeLine(data); }
        else {
          var lastLine = this.lines.pop();
          this.line.push(this.indentations.join('') + lastLine + data);
        }
      }
    }

    Generator.prototype.getData = function() {
      return this.lines.join('\n');
    }

    function replaceAll(str, search, replacement) {
      return str.split(search).join(replacement);
    };

    exports.Generator = Generator;
    exports.replaceAll = replaceAll;
});
