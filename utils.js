/*
 * Copyright (c) 2016 Komputent. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

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
