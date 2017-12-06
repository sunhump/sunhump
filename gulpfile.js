const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

let dev = true;

gulp.task('styles', () => {
  return gulp.src('app/scss/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass({
      includePaths: ['node_modules/foundation-sites/scss'],
    }).on('error', $.sass.logError))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(reload({stream: true}));
});

// function bundle (bundler) {
//   bundler
//     .bundle()
//     .pipe(source('app.js')) 
//     .pipe(buffer())
//     .pipe(uglify())
//     .pipe(flatten())
//     .pipe(sourcemaps.init({ loadMaps : true }))
//     .pipe(sourcemaps.write('./maps/'))
//     .pipe(gulp.dest('./frontend/dist/js/'))
// }
// gulp.task('bundle', function () {
//   var bundler = browserify('./frontend/app/app.js')
//       .transform(babelify, { presets : [ 'es2015' ] });
//   bundle(bundler);
// });

// gulp.task('scripts', () => {
//   return gulp.src('app/scripts/**/*.js')
//     .pipe($.plumber())
//     .pipe($.if(dev, $.sourcemaps.init()))
//     .pipe($.babel())
//     .pipe($.if(dev, $.sourcemaps.write('.')))
//     .pipe(gulp.dest('.tmp/scripts'))
//     .pipe(reload({stream: true}));
// });

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: false,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/assets/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/assets/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/assets/',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('develop', () => {
  runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/index.html',
      'app/pages/*.html',
      'app/assets/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);
    gulp.watch('app/**/*.scss', ['styles']);
    gulp.watch('app/scss/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/assets/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('develop:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('develop:test', ['scripts'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/scss/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/scss'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('production', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'production', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'production', resolve);
  });
});
