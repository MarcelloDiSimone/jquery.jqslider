module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Project configuration.
	grunt.initConfig({
		/**
		 * configure the correct path layout of your project here
		 */
		dest: {
			source: './src',
			deploy: './deploy'
		},
        pkg: '<json:package.json>',
        meta: {
            banner: '/*!\n' +
                ' * <%= pkg.name %> <%= pkg.version %> \n' +
                ' * \n' +
                ' * @date $Date: <%= grunt.template.today() %> $ \n' +
                ' * @author <%= _.pluck(pkg.contributors, "name").join("\n * @author ") %> \n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>; \n' +
                ' * @version <%= pkg.version %> \n' +
                ' */'
        },
		jshint: {
			options: {
				browser: true,
				devel: true,
				maxerr: 1000,
				strict: false
			}
		},
		lint: {
			files: ['<%= dest.source %>/js/*.js']
		},
        less: {
            deploy: {
                options: {
                    compress: true
                },
                files: {
                    "<%= dest.deploy %>/css/*.css": "<%= dest.source %>/css/**/*.less"
                }
            }
        },
        min: {
            deploy: {
                src: ['<banner:meta.banner>', '<%= dest.source %>/js/*.js'],
                dest: '<%= dest.deploy %>/js/jquery.jqslider.min.js'
            }
        }
	});

	grunt.registerTask('default', 'lint less min');
};
