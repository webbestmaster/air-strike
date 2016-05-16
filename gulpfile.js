'use strict';

var gulp = require('gulp'),
// clean = require('gulp-rimraf'),
	minifyHTML = require('gulp-minify-html'),
	minifyCss = require('gulp-minify-css'),
	rjs = require('gulp-requirejs'),
	uglify = require('gulp-uglify'),
	fs = require('fs'),
	requirePaths;

(function () {

	requirePaths =
		JSON.parse(
			fs.readFileSync('www/js/require-config.js')
			.toString()
			.replace(/\/\/[\s\S]+?\n/g, '') 	// remove comments
			.replace(/\'/g, '\"') 				// prop: 'value' to prop : "value"
			.replace(/(\S+)\:/g, '\"$1\":') 	// prop: "value" to "prop" : "value"
			.match(/\{[\s\S]+\}/)
			.toString()
	);

	console.log(requirePaths);

}());

gulp.task('default', function () {
	return gulp.start('copy-assets', 'html', 'css', 'js');
});

gulp.task('watch', ['html', 'css', 'js-watch', 'copy-assets'], function () {
	gulp.watch('./www/*.html', ['html']);
	gulp.watch('./www/css/**/*', ['css']);
	gulp.watch('./www/js/**/*', ['js-watch']);
	gulp.watch('./www/src/**/*', ['copy-assets']);
});

gulp.task('html', function () {
	return gulp.src('./www/*.html')
		.pipe(minifyHTML({
			conditionals: true,
			spare: true
		}))
		.pipe(gulp.dest('./dist/www/'));
});

gulp.task('css', function () {
	return gulp.src('./www/css/main.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('./dist/www/css'));
});

// JS
gulp.task('js', function () {
	return gulp.start('collect-js', 'uglify-js');
});

gulp.task('js-watch', function () {
	return gulp.start('collect-js');
});

gulp.task('collect-js', function () {

	return gulp
		.src('js')
		.pipe(rjs({
			name: 'main',
			baseUrl: './www/js/',
			out: 'main.js',
			// copy paths from main.js
			paths: requirePaths
		}))
		.pipe(gulp.dest('./dist/www/js/'));

});

gulp.task('uglify-js', ['collect-js'], function () {
	return gulp.src('./dist/www/js/main.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/www/js/'));
});

// copy data
gulp.task('copy-assets', function () {

	// folders
	['src', 'font'].forEach(function (dir) {
		return gulp.src('./www/' + dir + '/**/*')
			.pipe(gulp.dest('./dist/www/' + dir));
	});

	// files
	['favicon.ico', 'js/require.js'].forEach(function (pathToFile) {

		// remove file's name from the path
		var pathToFileFolders = pathToFile.indexOf('/') === -1 ? '' :  pathToFile.replace(/\/[^\/]+?$/, '');

		return gulp.src('./www/' + pathToFile)
			.pipe(gulp.dest('./dist/www/' + pathToFileFolders));

	});

});
