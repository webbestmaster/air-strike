'use strict';

var gulp = require('gulp'),
	// clean = require('gulp-rimraf'),
	minifyHTML = require('gulp-minify-html'),
	minifyCss = require('gulp-minify-css'),
	es6Import = require('gulp-es6-import');

gulp.task('default', function () {
	return gulp.start('html', 'css', 'js');
});

gulp.task('watch', ['html', 'css', 'js'], function () {
	gulp.watch('./www/*.html', ['html']);
	gulp.watch('./www/css/**/*', ['css']);
	gulp.watch('./www/js/**/*', ['js']);
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
	return gulp.start('collect-js');
});

gulp.task('collect-js', function () {
	return gulp.src('./www/js/main.js')
		.pipe(es6Import())
		.pipe(gulp.dest('./dist/www/js/'));
});
