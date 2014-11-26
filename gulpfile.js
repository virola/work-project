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
var jshint = require('gulp-jshint');

var projects = ['campus-pc', 'campus-mobile', 'magazine', 'newmaga', 'desserts'];
var config = {
    'campus-pc': {
        dir: 'campus-topic/pc'
    },
    'campus-mobile': {
        dir: 'campus-topic/mobile'
    },
    'magazine': {
        dir: 'magazine',
        concat: false
    },
    'newmaga': {
        dir: 'new-maga',
        concat: false,
        less: 'single'
    },
    'desserts': {}
};

var paths = {
    js:     ['src/js/*.js'],
    less:   ['src/css/*.less'],
    lessDest: ['src/css/main.less'],
    img:    ['src/img/*.png', 'src/img/**/*.png']
};

projects.forEach(function (project, i) {
    var dir = config[project] && config[project].dir;
    if (!dir) {
        dir = project;
    }

    var isConcat = config[project].concat || 1;;
    gulp.task(project + 'js', function() {
        var stream = gulp.src(dir + '/' + paths.js);
        if (isConcat == false) {
            stream = stream.pipe(concat('main.js'));
        }
            
        return stream.pipe(gulp.dest(dir + '/' + 'asset/js'));
    });


    gulp.task(project + 'uglify', [project + 'js'], function() {
        return gulp.src([dir + '/' + 'asset/js/*.js'])
            .pipe(uglify({
                mangle: {
                    except: ['require', 'define', 'export']
                },
                compress: true
            }))
            .pipe(gulp.dest(dir + '/' + 'asset/js'));
    });

    gulp.task(project + 'img', function() {
        return gulp.src(dir + '/' + paths.img)
            .pipe(imagemin({optimizationLevel: 5}))
            .pipe(gulp.dest(dir + '/' + 'asset/img'));
    });

    gulp.task(project + 'less', function () {
        var lesspath = paths.lessDest;
        if (config[project].less && config[project].less == 'single') {
            lesspath = paths.less;
        }
        gulp.src(dir + '/' + lesspath)
            .pipe(less())
            .pipe(gulp.dest(dir + '/' + 'asset/css'));
    });

    gulp.task(project + 'less-build', function () {
        gulp.src(dir + '/' + paths.lessDest)
            .pipe(less({compress: true}))
            .pipe(gulp.dest(dir + '/' + 'asset/css'));
    });

    gulp.task(project + 'watch', function() {
        gulp.watch(dir + '/' + paths.js, [project +'js']);
        gulp.watch(dir + '/' + paths.less, [project +'less']);
    });

    gulp.task(project + 'test', function () {
        return gulp.src(dir + '/' + paths.js)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    gulp.task(project, [
        // project + 'clean', 
        project + 'js', 
        project + 'less'
    ]);

    gulp.task(project + 'build', [
        // project + 'clean', 
        project + 'uglify', 
        project + 'less-build'
    ]);
});



gulp.task('build', (function () {
    var tasks = [];
    projects.forEach(function (proj, i) {
        tasks.push(proj + 'build');
    });
    return tasks;
})());

gulp.task('test', (function () {
    var tasks = [];
    projects.forEach(function (proj, i) {
        tasks.push(proj + 'test');
    });
    return tasks;
})());

gulp.task('debug', (function () {
    var tasks = [];
    projects.forEach(function (proj, i) {
        tasks.push(proj);
    });
    return tasks;
})());

gulp.task('watch', (function () {
    var tasks = [];
    projects.forEach(function (proj, i) {
        tasks.push(proj + 'watch');
    });
    return tasks;
})());