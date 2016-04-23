'use strict';

var gulp = require('gulp'),
// clean = require('gulp-rimraf'),
	minifyHTML = require('gulp-minify-html'),
	minifyCss = require('gulp-minify-css'),
	rjs = require('gulp-requirejs'),
	uglify = require('gulp-uglify');

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
		.src('')
		.pipe(rjs({
			name: 'main',
			baseUrl: './www/js/',
			out: 'main.js',
			// copy paths from main.js
			paths: {
				log: 'services/log',
				mediator: 'services/mediator',
				// init libs
				Deferred: 'lib/deferred',
				fontLoader: 'lib/font-loader',
				PIXI: 'lib/pixi',
				EasePack: 'lib/EasePack',
				TweenLite: 'lib/TweenLite',
				FPSMeter: 'lib/fpsmeter',
				// init service
				device: 'services/device',
				deviceEvents: 'services/device-events',
				// core
				renderer: 'core/renderer',
				rendererKeys: 'core/renderer-keys',
				textureMaster: 'core/texture-master',
				textureSources: 'core/texture-sources',
				DisplayObject: 'core/display-object',
				BaseView: 'core/base-view',
				BaseViewEvents: 'core/base-view-events',
				Button: 'core/button',
				loader: 'core/loader',
				camera: 'core/camera',
				// views
				TitleView: 'view/title/view',
				SettingView: 'view/setting/view',



				// game
				GameModel: 'game/model',
				GameView: 'game/view',
				gameKeys: 'game/game-keys',
				Factory: 'factory/factory',
				factoryKeys: 'factory/factory-keys',
				objectKeys: 'factory/object-keys',
				constructorMap: 'factory/constructor-map',

				// game objects
				Bullet: 'objects/bullet'
			}
		}))
		.pipe(gulp.dest('./dist/www/js/'));

});

gulp.task('uglify-js', ['collect-js'], function () {
	return gulp.src('./dist/www/js/main.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/www/js'));
});

// copy data
gulp.task('copy-assets', function () {
	['src', 'font'].forEach(function (dir) {
		return gulp.src('./www/' + dir + '/**/*')
			.pipe(gulp.dest('./dist/www/' + dir));
	});
});
