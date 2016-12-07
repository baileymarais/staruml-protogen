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

  var Commands        = app.getModule('command/Commands'),
      CommandManager  = app.getModule('command/CommandManager'),
      FileSystem      = app.getModule('filesystem/FileSystem'),
      MenuManager     = app.getModule('menu/MenuManager'),
      ProjectManager  = app.getModule('engine/ProjectManager'),
      Toast           = app.getModule('ui/Toast');

  var ProtobufGenerator = require('generator');

  function _handleGenerate() {
    var result = $.Deferred(),
        project = ProjectManager.getProject();

    if (!!project) {
      FileSystem.showOpenDialog(false, true, 'Pick the folder where the Protocol Buffers will be generated', null, null, function (err, selectedPath) {
        if (!err && selectedPath.length > 0) {
          ProtobufGenerator.generate(project, selectedPath).then(result.resolve, result.reject);
        } else {
          Toast.warning('Protocol Buffer generation was cancelled');
          result.reject(FileSystem.USER_CANCELED);
        }
      });
    } else {
      Toast.error('No project found');
      return result.reject('No project found');
    }

    return result.promise();
  }

  // Add a Protogen command.
  var CMD_PROTOGEN = "tools.protogen";
  CommandManager.register("Generate Protocol Buffers", CMD_PROTOGEN, _handleGenerate);

  // Add Protogen menu item (Tools > Generate Protocol Buffers).
  var menu = MenuManager.getMenu(Commands.TOOLS);
  menu.addMenuItem(CMD_PROTOGEN);
});
