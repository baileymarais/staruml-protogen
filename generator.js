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

    if (typeof map[field.type] !== 'undefined') {
      return map[field.type];
    } else {
      return undefined;
    }
  }

  function writeProtobuf(service, model, packageName, basePath) {
    var generator = new Utils.Generator();

    _initializeProtobuf(generator, packageName);
    generator.writeLine('message ' + model.name + ' {');
    generator.indent();
    model.columns.forEach(function (field, index) {
      var fieldName = _fieldName(field),
          dataType  = _dataType(field);

      generator.writeLine(dataType + ' ' + field.name + ' = ' + index + ';');
    });
    generator.outdent();
    generator.writeLine('}');

    // Save the generated file to the file system.
    var file = FileSystem.getFileForPath(basePath + '/' + model.name + '.proto');
    FileUtils.writeText(file, generator.getData(), true);

    Toast.info('Succesfully generated protobuf for ' + model.name);
  }

  function generate(project, basePath) {
    var result = $.Deferred();

    project.ownedElements.forEach(function (e) {
      if (e instanceof type.ERDDataModel) {
        var packageName = e.name + '.models';

        e.ownedElements.forEach(function (model) {
          if (model instanceof type.ERDEntity) {
            writeProtobuf(e, model, packageName, basePath);
          }
        });
      }
    });

    return result.promise()
  }

  exports.generate = generate;
});
