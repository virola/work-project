var gulp = require('gulp');

gulp.task('default', function() {
    // place code for your default task here
});

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var projects = ['campus-topic'];

var paths = {
    js:     ['src/*.js'],
    less:   ['src/css/*.less'],
    lessDest: ['src/css/main.less'],
    img:    ['src/']
};

projects.forEach(function (dir, i) {
    gulp.task(dir + '-clean', function (cb) {
        del([dir + '/asset'], cb);
    });

    gulp.task(dir + '-' + 'js', function() {
        return gulp.src(dir + '/' + paths.js)
            .pipe(concat('main.js'))
            .pipe(gulp.dest(dir + '/' + 'asset/js'));
    });


    gulp.task(dir + '-' + 'uglify', [dir + '-' + 'js'], function() {
        return gulp.src([dir + '/' + 'asset/js/*.js'])
            .pipe(uglify())
            .pipe(gulp.dest(dir + '/' + 'asset/js'));
    });

    gulp.task(dir + '-' + 'img', function() {
        return gulp.src(dir + '/' + paths.img)
            .pipe(imagemin({optimizationLevel: 5}))
            .pipe(gulp.dest(dir + '/' + 'asset/img'));
    });

    gulp.task(dir + '-' + 'less', function () {
        gulp.src(dir + '/' + paths.lessDest)
            .pipe(less({compress: true}))
            .pipe(gulp.dest(dir + '/' + 'asset/css'));
    });

    gulp.task(dir + '-' + 'watch', function() {
        gulp.watch(dir + '/' + paths.js, [dir + '-' +'js']);
        gulp.watch(dir + '/' + paths.less, [dir + '-' +'less']);
        gulp.watch(dir + '/' + paths.img, [dir + '-' +'img']);
    });

    gulp.task(dir + '-' + 'build', [
        dir + '-' + 'clean', 
        dir + '-' + 'uglify', 
        dir + '-' + 'cssmin', 
        dir + '-' + 'img'
    ]);
});

gulp.task('build', (function () {
    var tasks = [];
    projects.forEach(function (proj, i) {
        tasks.push(proj + '-' + 'build');
    });
    return tasks;
})());
