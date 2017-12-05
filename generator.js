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

  var FileSystem  = app.getModule('filesystem/FileSystem'),
      FileUtils   = app.getModule("file/FileUtils"),
      Toast       = app.getModule('ui/Toast');

  var Utils = require('utils');

  function _initializeProtobuf(generator, packageName) {
    var protoPackage = (packageName ? packageName : "autogen.models");
    generator.writeLine('syntax = "proto3";');
    generator.writeLine('package ' + protoPackage + ';');
    generator.writeLine();
  }

  // TODO(sathyp): Offer the ability to modify MAX_LINE_LENGTH to users.
  function _writeComment(generator, comment) {
    var COMMENT_PREFIX = '// ',
        MAX_LINE_LENGTH = 80 - COMMENT_PREFIX.length; // Default line limit of 80 chars.

    var commentLines = Utils.splitter(comment, MAX_LINE_LENGTH);

    commentLines.forEach(function (c) {
      generator.writeLine(COMMENT_PREFIX + c);
    });
  }

  function _fieldName(field) {
    var fieldName = Utils.replaceAll(field.name, ' ', '_');
    return fieldName;
  }

  function _dataType(field) {
    var map = {
      VARCHAR: "string",
      BOOLEAN: "bool",
      INTEGER: "int32",
      CHAR: "string",
      BINARY: "byte",
      VARBINARY: "byte",
      BLOB: "byte",
      TEXT: "string",
      SMALLINT: "int32",
      BIGINT: "int64",
      DECIMAL: "double",
      NUMERIC: "int32",
      FLOAT: "float",
      DOUBLE: "double",
      BIT: "bool",
      DATE: undefined,
      TIME: undefined,
      DATETIME: undefined,
      TIMESTAMPTZ: undefined,
      TIMESTAMP: undefined,
      POINT: undefined,
      POLYGON: undefined,
      CIDR: undefined,
      INET: undefined
    };

    // Handle foreign keys first.
    if (field.referenceTo) {
      return field.referenceTo._parent.name;
    } else if (typeof map[field.type] !== 'undefined') {
      return map[field.type];
    } else {
      return undefined;
    }
  }

  function writeProtobuf(service, model, packageName, basePath, protoPath) {
    var generator = new Utils.Generator();

    // Generate the syntax and package block.
    _initializeProtobuf(generator, packageName);

    // Determine local imports (within the same package).
    // TODO(sathyp): Write a custom tag which can import foreign message types.
    model.columns.forEach(function (field, index) {
      if (field.referenceTo) {
        if (!index) generator.writeLine();

        var foreignMsg = Utils.toSnakeCase(field.referenceTo._parent.name),
            importPath = foreignMsg + ".proto";

        if (protoPath) importPath = protoPath.value + '/' + importPath;
        generator.writeLine('import "' + importPath + '";');

        if (index == model.columns.length - 1) generator.writeLine();
      }
    });

    // Write the message definition / body.
    if (model.documentation) { _writeComment(generator, model.documentation); }
    generator.writeLine('message ' + model.name + ' {');
    generator.indent();
    model.columns.forEach(function (field, index) {
      var fieldName = _fieldName(field),
          dataType  = _dataType(field),
          tagNum = index + 1;

      if (index) generator.writeLine();
      if (field.documentation) { _writeComment(generator, field.documentation); }
      generator.writeLine((field.unique?'repeated ':'') + dataType + ' ' + field.name + ' = ' + tagNum + ';');
    });
    generator.outdent();
    generator.writeLine('}');

    // Save the generated file to the file system.
    var fileName = Utils.toSnakeCase(model.name)
    var file = FileSystem.getFileForPath(basePath + '/' + fileName + '.proto');
    FileUtils.writeText(file, generator.getData(), true);

    Toast.info('Succesfully generated protobuf for ' + model.name);
  }

  function generate(project, basePath) {
    var result = $.Deferred();

    project.ownedElements.forEach(function (e) {
      if (e instanceof type.ERDDataModel) {
        var packageName = e.name + '.models';

        var protoPath = Utils.tag('proto_path', e);

        e.ownedElements.forEach(function (model) {
          if (model instanceof type.ERDEntity) {
            writeProtobuf(e, model, packageName, basePath, protoPath);
          }
        });
      }
    });

    return result.promise()
  }

  exports.generate = generate;
});
