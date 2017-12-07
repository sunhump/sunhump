const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const runSequence = require('run-sequence');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const babelify = require('babelify');
const panini = require('panini');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

require('dotenv').config();

let dev = process.env.NODE_ENV === 'development';


gulp.task('styles', () => {
  return gulp.src('./app/app.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass({
      
      includePaths: [
        // Foundation - Uncomment to use foundation
        //'./node_modules/foundation-sites/scss'
      ],

    }).on('error', $.sass.logError))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest(process.env.BUILD_PATH + 'styles'))
    .pipe(reload({stream: true}));
});

gulp.task('lint', () => {
  return gulp.src(['./app/**/*.js','!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

function bundle (bundler) {
  bundler
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe($.flatten())
    .pipe($.if(dev, $.sourcemaps.init({ loadMaps : true })))
    .pipe($.if(dev, $.sourcemaps.write('./maps/')))
    .pipe(gulp.dest(process.env.BUILD_PATH + 'scripts'))
    .pipe(reload({stream: true}));
}
gulp.task('bundle', function () {
  var bundler = browserify('./app/app.js')
      .transform(babelify);
  bundle(bundler);
});

gulp.task('panini', function() {
  gulp.src('./app/pages/**/*.html')
    .pipe(panini({
      root:     './app/pages/',
      layouts:  './app/layouts/',
      partials: './app/components/',
      helpers:  './app/helpers/',
      data:     './app/data/'
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('browsersync.reload', function() {
  browserSync.reload();
});

gulp.task('images', () => {
  return gulp.src('./app/assets/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest(process.env.BUILD_PATH + 'images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('./app/assets/fonts/**/*'))
    .pipe($.if(dev, gulp.dest(process.env.BUILD_PATH + '.tmp/fonts'), gulp.dest(process.env.BUILD_PATH + 'fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    './app/assets/**/*',
    '!./app/assets/images/**/*',
    '!./app/assets/fonts/**/*'
  ], {
    dot: true
  }).pipe(gulp.dest(process.env.BUILD_PATH));
});

gulp.task('clean', del.bind(null, ['.tmp', process.env.BUILD_PATH]));

gulp.task('develop', () => {
  runSequence(['clean'], ['styles', 'lint', 'bundle', 'panini', 'fonts'], () => {
    browserSync.init({
      notify: false,
      port: process.env.SERVER_PORT,
      server: {
        baseDir: ['.tmp'],
        routes: {
          // '/bower_components': 'bower_components'

          '/scripts': process.env.BUILD_PATH + '/scripts',
          '/styles': process.env.BUILD_PATH + '/styles',
        }
      }
    });

    gulp.watch('./app/**/*.scss', ['styles']);
    gulp.watch('./app/**/*.js', ['bundle']);
    gulp.watch('./app/assets/fonts/**/*', ['fonts']);
    gulp.watch('./app/assets/images/**/*', ['images']);
    gulp.watch(['./app/{layouts,components,helpers,data,pages}/**/*.html'], ['panini', 'browsersync.reload']);
  });
});

// gulp.task('develop:dist', ['default'], () => {
//   browserSync.init({
//     notify: false,
//     port: process.env.SERVER_PORT,
//     server: {
//       baseDir: [process.env.BUILD_PATH]
//     }
//   });
// });

// gulp.task('develop:test', ['bundle'], () => {
//   browserSync.init({
//     notify: false,
//     port: process.env.SERVER_PORT,
//     ui: false,
//     server: {
//       baseDir: 'test',
//       routes: {
//         '/scripts': process.env.BUILD_PATH + '.tmp/scripts',
//       }
//     }
//   });

//   gulp.watch('./app/**/*.js', ['bundle']);
//   gulp.watch(['./test/spec/**/*.js', './test/index.html']).on('change', reload);
//   gulp.watch('./test/spec/**/*.js');
// });

gulp.task('production', ['clean', 'lint', 'bundle', 'panini', 'images', 'fonts', 'extras'], () => {
  return gulp.src(process.env.BUILD_PATH + '/**/*').pipe($.size({title: 'production', gzip: true}));
});

gulp.task('default', ['develop']);