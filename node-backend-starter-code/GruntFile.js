module.exports = function(grunt){

	//we're using grunt in development to hint our code and also restart the server when we make any changes
	grunt.initConfig({
		jshint: {
			files: ["*.js", "/test/*.js"], 
			options: {
				esnext: true //check this
			}
		},
		uglify: {
		    my_target: {
		    	files: {
		        	'public/js/client.min.js': ['client.js']
		     	}
		    }
		}, 
		watch: {
			scripts: {
				files: ["*.js"],
				tasks: ["jshint", "uglify"]
			}
		}
	});

	//load the additional packages we need to use with grunt
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	//declare a default task that runs jshint and browserify
	grunt.registerTask("default", ["jshint", "uglify"]);
};