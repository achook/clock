const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const babel= require('gulp-babel')
const browserify = require('browserify')
const tap = require('gulp-tap')
const buffer = require('gulp-buffer')
const uglify = require('gulp-uglify')
const csso = require('gulp-csso')
const sw = require('sw-precache')
const clean = require('gulp-clean')
const ga = require('gulp-ga')
const htmlmin = require('gulp-htmlmin')

gulp.task('html', function () {
  return gulp.src('src/**/*.pug')
    .pipe(pug())
    //.pipe(ga({ url: 'clock.kucza.xyz', uid: 'UA-91003040-3' }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(tap(function (file) {
      file.contents = browserify(file.path, { debug: true }).bundle();
    }))
    .pipe(buffer())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('css', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sass())
    .pipe(csso({
      comments: false
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('other', function () {
  return gulp.src(['src/**/*.*', '!**/*.pug', '!**/*.js', '!**/*.css'])
    .pipe(gulp.dest('dist'))
})

gulp.task('generate-sw', function (callback) {
  const rootDir = './dist';

  sw.write('src/sw.js', {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,svg,png,json,xml,ico}'],
    stripPrefix: `${rootDir}`
  }, callback);
})

gulp.task('minify-sw', function () {
  return gulp.src('src/sw.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(clean( {force: true} ))
    .pipe(gulp.dest('dist'))
})

gulp.task('sw', gulp.series('generate-sw', 'minify-sw'))

gulp.task('default', gulp.series(gulp.parallel('html', 'js', 'css', 'other'), 'sw') )
