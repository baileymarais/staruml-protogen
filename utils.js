define(function (require, exports, module) {
    "use strict";

    function Generator(indentString) {
      this.lines = [];
      this.indentations = [];
      this.indentString = (indentString ? indentString : '    '); // default 4 spaces
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

    function splitter(str, l) {
        var strs = [];
        while (str.length > l) {
            var pos = str.substring(0, l).lastIndexOf(' ');
            pos = pos <= 0 ? l : pos;
            strs.push(str.substring(0, pos));
            var i = str.indexOf(' ', pos)+1;
            if (i < pos || i > pos+l) { i = pos; }
            str = str.substring(i);
        }
        strs.push(str);
        return strs;
    };

    exports.Generator = Generator;
    exports.replaceAll = replaceAll;
    exports.splitter = splitter;
});
