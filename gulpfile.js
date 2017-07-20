const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const babel= require('gulp-babel')
const browserify = require('browserify')
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');

gulp.task('html', function () {
  return gulp.src('src/**/*.pug')
    .pipe(sourcemaps.init({ loadMaps: true }))  
    .pipe(pug())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))  
    .pipe(tap(function (file) {
      file.contents = browserify(file.path, { debug: true }).bundle();
    }))
    .pipe(buffer())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})

gulp.task('css', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))    
    .pipe(sass())
    .pipe(csso())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', gulp.parallel('html', 'js', 'css'))