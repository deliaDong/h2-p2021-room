/*
 *
 * Commands :
 *
 * $gulp // to launch development server
 * 
 * $gulp build // to build project
 * 
 */

/*
 *
 * Error handling
 *
 */

const gutil = require('gulp-util')
// Enter following code after to handle error

/*

.on('error', function(err) {
  gutil.log(gutil.colors.red('[Error]'), err.toString());
  this.emit('end');
  })

*/

const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const gulpIf = require('gulp-if')
const stylus = require('gulp-stylus')
const size = require('gulp-size')
const sourcemaps = require('gulp-sourcemaps')
const useref = require('gulp-useref')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

// File cleaning
const del = require('del')

// Server
const browserSync = require('browser-sync')

// Sequencing
const runSequence = require('run-sequence')

/*
 *
 * Config
 *
 */

// Global path
const devPath = 'dev/'

const path = {
  styl: `${devPath}assets/styl/main.styl`,
  stylAll: `${devPath}assets/styl/**/*.styl`,
  css: `${devPath}assets/css`,
  js: `${devPath}assets/js/*.js`,
  js_vendor: `${devPath}assets/js/vendor/*.js`,
  web: `${devPath}**/*.+(html|php)`,
  dist: `dist`
}

// Folders to export with $ gulp export, will basically copy paste each folder in the array
folders = ['assets/img']

// Server config :

// static = html, !static = php
const static = true
// If static = false, then set local path :
const localPath = 'localhost/Github/dynamic-gulp-template/dev'

/*
 *
 * End of config
 *
 */

// Reload shorthand
const reload = browserSync.reload

// Config the server for dynamic or non dynamic
const serverConf = {}

if (static) {
  serverConf.server = {
    baseDir: 'dev'
  }
} else {
  // Server port, 3000 for html 8000 for php with XAMPP, etc.
  serverConf.port = 8000
  // Server path (blank for html)
  serverConf.proxy = localPath
}

/*
 *
 * Processing
 *
 */

// Stylus compilation
gulp.task('styl', () => {
  return gulp
      .src(path.styl)
      .pipe(sourcemaps.init())
      .pipe(stylus())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.css))
      .pipe(size())
      .pipe(reload({ stream: true }));
})

// Watcher
gulp.task('watch', ['browserSync', 'styl'], () => {
  gulp.watch(path.stylAll, ['styl']); 
  gulp.watch(path.web, reload); 
  gulp.watch(path.js, reload); 
})

// Server setup
gulp.task('browserSync', () => {
  browserSync(serverConf)
})

/*
 *
 * Exporting
 *
 */

// Delete current export folder
gulp.task('clean', () => {
  del('dist')
})

// Folder export before
gulp.task('export', () => {
  for (const folder of folders) {
    gulp.src([`${devPath}${folder}/**/*`, `${devPath}${folder}/**/.*`])
    .pipe(gulp.dest(`${path.dist}/${folder}`))
  }
  gulp.src([`${devPath}*.*`, `!${path.web}`]).pipe(gulp.dest(`${path.dist}/`))
})

// JS, CSS export
gulp.task('useref', () => {
  return gulp
    .src(path.web)
    .pipe(useref({searchPath: devPath}))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulpIf('*.js', babel({
      presets: ['env']
    })))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest(path.dist))
})

// Folder export after useref
gulp.task('exportAfter', () => {
  gulp.src(path.js_vendor).pipe(gulp.dest(`${path.dist}/js/vendor`))
})


// Global export
gulp.task('build', (callback) => {
  runSequence(
    'clean',
    'styl',
    'export',
    'useref',
    'exportAfter',
    callback
  )
})

/*
 *
 * Default
 *
 */

// gulp command will load...
gulp.task('default', ['watch'], () => {});
