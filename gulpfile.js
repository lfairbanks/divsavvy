var gulp = require('gulp');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');  


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
  //return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/style.scss', 'src/scss/custom.scss'])
  return gulp.src(['vendor/twbs/bootstrap/scss/bootstrap.scss', 'src/scss/style.scss', 'src/scss/custom.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Move the Node Module javascript files into the /src/js folder
gulp.task('js', function () {
  //return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 'node_modules/jquery/dist/jquery.min.js'])
  return gulp.src(['vendor/twbs/bootstrap/dist/js/bootstrap.bundle.min.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
});
//PHP - Server Creation
gulp.task('connect-sync', function () {
  connect.server({}, function () {
    browserSync.init({
      proxy: 'localhost:8082', 
      port:8082  
    });
    gulp.watch('*src/*.php').on('change', function () { browserSync.reload(); });
    gulp.watch(['vendor/twbs/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    //gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch([]); 
    gulp.watch('src/js/*.js').on('change', function () { browserSync.reload(); });
    //gulp.watch('gulpfile.js').on('change', function () { browserSync.reload(); });

  }); 
});
//clean css 
gulp.task('minify-css',() => {
  return gulp.src('src/css/*.css')
    .pipe(sourcemaps.init())
    //.pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/dist/css/'));
});
// folders
  folder = {
    src: 'src/assets/',
    dist: 'src/dist/assets/'
  };
// image processing
gulp.task('images', function() {
  var out = folder.dist + 'images/';
  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

// Leave At End
gulp.task('default', ['js','connect-sync','sass','minify-css','images']);