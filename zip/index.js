var  fs  = require('fs'),
		archiver = require('archiver');

var pluginFactory = function( _, anvil ) {
	return anvil.plugin({
		// Name your plugin
		name: "anvil.zip",
		// Activity list: "identify", "pull", "combine", "pre-process","compile", "post-process", "push", "test"
		activity: "push",
		// Config Variables
		config: {
			buildDir: "./build"
		},

		// Computed Build Path
		buildPath: "./build",

		// Computed Output Path
		outputPath: null,

		// Archiver utility to help when zipping a file
		zip: null,

		// Configure all the things...
		configure: function( config, command, done ) {
			this.buildPath = anvil.fs.buildPath( this.config.buildDir );
			anvil.fs.pathExists( this.config.buildDir );

			this.outputPath = fs.realpathSync( this.buildPath ) + "/build-" + new Date().getTime() + ".zip";

			// Ensure build path exists
			anvil.fs.ensurePath( this.buildPath, function ( err ) {
				if( err ) {
					anvil.log.error( err );
					done();
				}
			});

			done();
		},

		// Run all the things...
		run: function( done ) {

			var out = fs.createWriteStream(this.outputPath),
					that,
					fileName;

			this.zip = archiver.createZip({ level: 1 });
			this.zip.pipe(out);

			that = this;
			anvil.fs.getFiles(anvil.config.output,anvil.config.output,
				function(files, directories) {

					var addZipFiles = _.map(files, function(file) {
						return function(done) {
							fileName = file.relativePath == "/" ? "/" + file.name : file.relativePath + "/" + file.name;
							that.zip.addFile(fs.createReadStream(file.fullPath), { name: fileName }, done);
							anvil.log.debug("Adding file to ZIP: " + fileName);
						}
					})

					anvil.scheduler.pipeline( undefined, addZipFiles, function() {
						that.zip.finalize(function(size) { 
							anvil.log.event("Wrote zip file to: "+ that.outputPath);
							done();
						});
					});

				}, [], -1);
		},
	});
};

module.exports = pluginFactory;
