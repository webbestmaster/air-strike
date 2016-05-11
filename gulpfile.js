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
		.src('js')
		.pipe(rjs({
			name: 'main',
			baseUrl: './www/js/',
			out: 'main.js',
			// copy paths from main.js
			paths: {
				// init service
				log: 'services/log',
				mediator: 'services/mediator',
				// init libs
				Deferred: 'lib/deferred',
				fontLoader: 'lib/font-loader',
				PIXI: 'lib/pixi',
				//EasePack: 'lib/EasePack',
				TweenMax: 'lib/TweenMax',
				FPSMeter: 'lib/fpsmeter',
				// init service
				device: 'services/device',
				deviceKeys: 'services/device-keys',
				// core
				// requireAsset: 'services/require-asset',
				renderer: 'core/renderer',
				rendererKeys: 'core/renderer-keys',
				textureMaster: 'core/texture-master',
				textureSources: 'core/texture-sources',
				DisplayObject: 'core/display-object',
				BaseView: 'core/base-view',
				baseViewKeys: 'core/base-view-keys',
				Button: 'core/button',
				loader: 'core/loader',
				camera: 'core/camera',
				cameraKeys: 'core/camera-keys',
				uiManager: 'core/ui-manager',
				uiManagerKeys: 'core/ui-manager-keys',
				// views
				TitleView: 'view/title/view',
				SettingView: 'view/setting/view',

				// game
				GameModel: 'game/game-model',
				GameView: 'game/game-view',
				gameKeys: 'game/game-keys',
				gameConfig: 'game/game-config',
				gameState: 'game/game-state',
				Factory: 'factory/factory',
				factoryKeys: 'factory/factory-keys',
				objectKeys: 'factory/object-keys',
				constructorMap: 'factory/constructor-map',

				// game objects
				GameObject: 'objects/game-object',
				gameObjectKeys: 'objects/game-object-keys',
				// gameObjectHelper: 'objects/game-object-helper',
				Aircraft: 'objects/aircraft',
				Bullet: 'objects/bullet',
				JuniorMissile: 'objects/junior-missile',
				Cross: 'objects/cross'
			}
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
