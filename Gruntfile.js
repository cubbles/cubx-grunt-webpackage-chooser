/*
 * grunt-cubx-webpackage-upload
 *
 *
 * Copyright (c) 2015 Hd Böhlau
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // Project configuration.
  const workspacePath = 'test/webpackages/';
  const workspaceConfigPath = workspacePath + '.workspace';
  let activeWebpackage;
  try {
    activeWebpackage = grunt.file.readJSON(workspaceConfigPath).activeWebpackage;
  } catch (err) {

  }
  const manifestWebpackagePath = workspacePath + activeWebpackage + '/manifest.webpackage';

  grunt.initConfig({

    // the option used within the devtools to load the workspace-config
    workspacePath: workspacePath,
    workspaceConfigPath: workspaceConfigPath,
    activeWebpackage: activeWebpackage,
    manifestWebpackagePath: manifestWebpackagePath
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
};
