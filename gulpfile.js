import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import sassGlob from 'gulp-sass-glob';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import concat from 'gulp-concat';
import rsync from 'gulp-rsync';
import del from 'del';
import pug from 'gulp-pug';

const {
  src,
  dest,
  parallel,
  series,
  watch,
} = gulp;

const sass = gulpSass(dartSass);
const filesWatch = 'html,htm,txt,json,md,woff2';

function brsrSnc() {
  browserSync.init({
    server: {
      baseDir: 'src/',
    },
    ghostMode: { clicks: false },
    notify: false,
    online: true,
    // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
  });
}

function scripts() {
  return src('src/scripts/common.js')
    .pipe(webpackStream({
      mode: 'production',
      performance: { hints: false },
      // plugins: [
      //   new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }),
      // ],
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false,
            },
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['babel-plugin-root-import'],
              },
            },
          },
        ],
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: { format: { comments: false } },
            extractComments: false,
          }),
        ],
      },
    }, webpack)).on('error', function handleError() {
      this.emit('end');
    })
    .pipe(dest('src/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src(['src/styles/*.*', '!src/styles/_*.*'])
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({ grid: 'autoplace' }),
      cssnano({ preset: ['default', { discardComments: { removeAll: true } }] }),
    ]))
    .pipe(concat('styles.min.css'))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
}

function images() {
  return src(['src/images/src/**/*'])
    .pipe(changed('src/images/docs'))
    .pipe(imagemin())
    .pipe(dest('src/images/docs'))
    .pipe(browserSync.stream());
}

function buildCopy() {
  return src([
    '{src/js,src/css}/*.min.*',
    'src/images/**/*.*',
    '!src/images/src/**/*',
    'src/**/*.html',
    'src/fonts/**/*',
  ], { base: 'src/' })
    .pipe(dest('docs'));
}

async function buildHtml() {
  return src('src/pug/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(dest('src'))
    .pipe(browserSync.stream());
}

async function cleanDocs() {
  del('docs/**/*', { force: true });
}

function deploy() {
  return src('docs/')
    .pipe(rsync({
      root: 'docs/',
      hostname: 'username@yousite.com',
      destination: 'yousite/public_html/',
      // clean: true, // Mirror copy with file deletion
      include: [/* '*.htaccess' */], // Included files to deploy,
      exclude: ['**/Thumbs.db', '**/*.DS_Store'],
      recursive: true,
      archive: true,
      silent: false,
      compress: true,
    }));
}

function startWatch() {
  watch('src/styles/**/*', { usePolling: true }, styles);
  watch('src/scripts/**/*.js', { usePolling: true }, scripts);
  watch('src/pug/**/*.pug', { usePolling: true }, buildHtml);
  watch('src/images/src/**/*', { usePolling: true }, images);
  watch(`src/**/*.{${filesWatch}}`, { usePolling: true }).on('change', browserSync.reload);
}

export {
  scripts,
  styles,
  images,
  deploy,
};
export const assets = series(scripts, styles, images);
export const build = series(cleanDocs, images, scripts, styles, buildCopy, buildHtml);
export default series(scripts, styles, images, buildHtml, parallel(brsrSnc, startWatch));
