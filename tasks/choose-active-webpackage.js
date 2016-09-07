'use strict';
var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');
module.exports = function (grunt) {
  grunt.registerTask('_change-activeWebpackage', 'Change the active webpackage.', function () {
    var workspacePath = grunt.config.get('workspacePath');
    var activeWebpackage = grunt.config.get('activeWebpackage');

    var workspaceConfigPath = grunt.config.get('workspaceConfigPath');
    var configFile;
    try {
      configFile = grunt.file.readJSON(workspaceConfigPath);
    } catch (err) {

    }
    if (!configFile || typeof configFile === 'undefined') {
      configFile = {
        activeWebpackage: ''
      };
    }
    var done = this.async();

    fs.readdir(workspacePath, function (err, files) {
      var choices = [];
      if (err) {
        grunt.fail.fatal(err);
      }
      files.forEach(function (file) {
        var pathName = path.join(workspacePath, file);
        if (fs.statSync(pathName).isDirectory()) {
          if (file === activeWebpackage && choices.length > 0) {
            choices.splice(0, 0, file);
          } else {
            choices.push(file);
          }
        }
      });

      choices.push('CANCEL');
      var options = {
        questions: [
          {
            name: 'selectedWebpackage',
            type: 'rawlist',
            message: 'Please type the index of your choice to change the activeWebpackage ' +
            'or to CANCEL: ',
            choices: choices,
            pageSize: choices.length,
            filter: function (val) {
              if (val.indexOf('CANCEL') === 0) {
                return 'CANCEL';
              }
              // return the configKey
              return val;
            }
          }
        ]
      };
      inquirer.prompt(options.questions).then(function (result) {
        // do upload, if user confirmed to do so
        if (result.selectedWebpackage !== 'CANCEL') {
          configFile.activeWebpackage = result.selectedWebpackage;
          grunt.file.write(workspaceConfigPath, JSON.stringify(configFile, null, 4));
        }
        done();
      });
    });
  });
};
