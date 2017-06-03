module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: ['src/engine/*.js', 'src/engine/stage/*.js', 'src/bootstrap.js', 'src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.es6.js'
            }
        },

        es6transpiler: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.es5.js': 'dist/<%= pkg.name %>.es6.js'
                }
            },
            options: {
                "disallowVars": false,
                "disallowDuplicated": true,
                "disallowUnknownReferences": false
            }
        },

        uglify: {
            options: {
                compress: true,
                mangle: true,
                sourceMap: false
            },
            target: {
                src: 'dist/<%= pkg.name %>.es5.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-es6-transpiler');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat', 'es6transpiler', 'uglify']);
};