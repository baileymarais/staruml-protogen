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

  // Add a Protogen command
  var CMD_PROTOGEN = "tools.protogen";
  CommandManager.register("Generate Protocol Buffers", CMD_PROTOGEN, _handleGenerate);

  // Add Protogen menu item (Tools > Generate Protocol Buffers)
  var menu = MenuManager.getMenu(Commands.TOOLS);
  menu.addMenuItem(CMD_PROTOGEN);
});
