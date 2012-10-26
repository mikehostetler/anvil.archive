var exec = require('exec-sync');

var pluginFactory = function( _, anvil ) {
    return anvil.plugin({
        // Name your plugin
        name: "anvil.webworks",
        // Activity list: "identify", "pull", "combine", "pre-process","compile", "post-process", "push", "test"
        activity: "test",
        // Command all the things [ "-s, --somecommand", "Run this plugin for awesomesauce" ]
        commander: [],
        // Configure all the things...
        configure: function( config, command, done ) {
            done();
        },
        config: {
						webWorksPath: "/Users/mikehostetler/Source/BB10WebWorks/BB10-WebWorks-SDK",
						buildPath: 
        },
        // Run all the things...
        run: function( done ) {

					// Package the ZIP into a .bar file
					// ./bbwp ~/myapp/myarchive.zip -d -o ~/myapp/output

					// blackberry-deploy -installApp -password bb10devpw -device 192.0.2.1 -package myApp.bar

					// Sign the .bar file

					// Deploy the bar file
          child = exec('echo "test" > ~/tmp.txt',
						function (error, stdout, stderr) {
							anvil.log.step('stdout: ' + stdout);
							anvil.log.step('stderr: ' + stderr);
							if (error !== null) {
								anvil.log.step('exec error: ' + error);
							}
					});	
        }
    } );
};

module.exports = pluginFactory;
