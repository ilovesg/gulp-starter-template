let fileswatch = 'html,htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

import pkg from 'gulp'
const { gulp, src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import bssi          from 'browsersync-ssi'
import ssi           from 'ssi'
import webpackStream from 'webpack-stream'
import webpack       from 'webpack'
import TerserPlugin  from 'terser-webpack-plugin'
import gulpSass      from 'gulp-sass'
import dartSass      from 'sass'
import sassglob      from 'gulp-sass-glob'
const  sass          = gulpSass(dartSass)
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import autoprefixer  from 'autoprefixer'
import imagemin      from 'gulp-imagemin'
import changed       from 'gulp-changed'
import concat        from 'gulp-concat'
import rsync         from 'gulp-rsync'
import del           from 'del'
import pug           from 'gulp-pug'

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'src/',
			middleware: bssi({ baseDir: 'src/', ext: '.html' })
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	})
}

function scripts() {
	return src(['src/js/**/*.js', '!src/js/*.min.js'])
		.pipe(webpackStream({
			mode: 'production',
			performance: { hints: false },
			// plugins: [
			// 	new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }),
			// ],
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								plugins: ['babel-plugin-root-import']
							}
						}
					}
				]
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: { format: { comments: false } },
						extractComments: false
					})
				]
			},
		}, webpack)).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(concat('scripts.min.js'))
		.pipe(dest('src/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src(['src/styles/sass/*.*', '!src/styles/sass/_*.*'])
		.pipe(eval('sassglob')())
		.pipe(eval('sass')({ 'include css': true }))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('styles.min.css'))
		.pipe(dest('src/css'))
		.pipe(browserSync.stream())
}

function images() {
	return src(['src/images/src/**/*'])
		.pipe(changed('src/images/docs'))
		.pipe(imagemin())
		.pipe(dest('src/images/docs'))
		.pipe(browserSync.stream())
}

function buildcopy() {
	return src([
		'{src/js,src/css}/*.min.*',
		'src/images/**/*.*',
		'!src/images/src/**/*',
		'src/**/*.html',
		'src/fonts/**/*',
	], { base: 'src/' })
	.pipe(dest('docs'))
}

async function buildhtml() {
	return src('src/pug/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(dest('src'))
    .pipe(browserSync.stream());
}

async function cleandocs() {
	del('docs/**/*', { force: true })
}

function deploy() {
	return src('docs/')
		.pipe(rsync({
			root: 'docs/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			// clean: true, // Mirror copy with file deletion
			include: [/* '*.htaccess' */], // Included files to deploy,
			exclude: [ '**/Thumbs.db', '**/*.DS_Store' ],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch('src/styles/sass/**/*', { usePolling: true }, styles)
	watch(['src/js/**/*.js', '!src/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('src/pug/**/*.pug', { usePolling: true }, buildhtml)
	watch('src/images/src/**/*', { usePolling: true }, images)
	watch(`src/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

export { scripts, styles, images, deploy }
export let assets = series(scripts, styles, images)
export let build = series(cleandocs, images, scripts, styles, buildcopy, buildhtml)
export default series(scripts, styles, images, buildhtml, parallel(browsersync, startwatch))
