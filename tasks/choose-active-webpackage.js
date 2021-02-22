'use strict';
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
module.exports = function (grunt) {
  grunt.registerTask('_change-activeWebpackage', 'Change the active webpackage.', function () {
    const workspacePath = grunt.config.get('workspacePath');
    const activeWebpackage = grunt.config.get('activeWebpackage');

    const workspaceConfigPath = grunt.config.get('workspaceConfigPath');
    let configFile;
    try {
      configFile = grunt.file.readJSON(workspaceConfigPath);
    } catch (err) {

    }
    if (!configFile || typeof configFile === 'undefined') {
      configFile = {
        activeWebpackage: ''
      };
    }
    const done = this.async();

    fs.readdir(workspacePath, function (err, files) {
      const choices = [];
      if (err) {
        grunt.fail.fatal(err);
      }
      files.forEach(function (file) {
        const pathName = path.join(workspacePath, file);
        if (fs.statSync(pathName).isDirectory()) {
          if (file === activeWebpackage && choices.length > 0) {
            choices.splice(0, 0, file);
          } else {
            choices.push(file);
          }
        }
      });

      choices.push('CANCEL');
      const options = {
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
