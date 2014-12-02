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
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var clean = require('gulp-clean');

var header = require('gulp-header');

var pkg = require('./package.json');
var banner = [
    '/**',
    ' * <%= project %>',
    ' * @version <%= nowStr %>',
    ' */',
    ''
].join('\n');

var date = new Date(); 
var nowStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
nowStr += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
// nowStr = date.toLocaleString();

var projects = ['campus-pc', 'campus-mobile', 'magazine', 'newmaga', 'desserts', 'pic'];
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
    'desserts': {},
    'pic': {
        dir: 'picture-view',
        concat: false,
        less: 'single'
    }
};

var paths = {
    js:     ['src/js/*.js'],
    less:   ['src/css/*.less'],
    lessDest: ['src/css/main.less'],
    img:    ['src/img/*.png', 'src/img/**/*.png']
};


var toolOptions = {
    uglify: {
        options: {
            banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        }
    },
    cssmin: {
        options: {
            banner: '/** <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> **/',
            compatibility: 'ie7'
        }
    },
    jshint: {
        options: {
            jshintrc: 'src/.jshintrc'
        },
        ignore_warning: {
            options: {
                '-W014': true,
                '-W102': true
            },
            src: ['src/**/*.js', 'src/**/**/*.js']
        }
    },

    concat: {
        options: {
            stripBanners: true
        }
    }
};

projects.forEach(function (project, i) {
    var dir = config[project] && config[project].dir;
    if (!dir) {
        dir = project;
    }

    gulp.task(project + 'cleanjs', function () {
        return gulp.src(dir + '/' + 'asset/js', {read: false, force: true})
            .pipe(clean());
    });
    gulp.task(project + 'cleancss', function () {
        return gulp.src(dir + '/' + 'asset/css', {read: false, force: true})
            .pipe(clean());
    });

    gulp.task(project + 'clean', function () {
        return gulp.src([dir + '/' + 'asset/js', dir + '/' + 'asset/css'], {read: false, force: true})
            .pipe(clean());
    });

    var isConcat = config[project].concat || 1;;
    gulp.task(project + 'js', [project + 'cleanjs'], function() {
        var stream = gulp.src(dir + '/' + paths.js);
        if (isConcat == false) {
            stream = stream.pipe(concat('main.js'));
        }
            
        return stream.pipe(gulp.dest(dir + '/' + 'asset/js'));
    });

    // uglify
    gulp.task(project + 'uglify', [project + 'js'], function() {
        return gulp.src([dir + '/' + 'asset/js/*.js'])
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify({
                mangle: {
                    except: ['require', 'define', 'export']
                },
                compress: true
            }))
            .pipe(header(banner, { project: project, nowStr: nowStr } ))
            .pipe(gulp.dest(dir + '/' + 'asset/js'));
    });

    // img
    // gulp.task(project + 'img', function() {
    //     return gulp.src(dir + '/' + paths.img)
    //         .pipe(imagemin({optimizationLevel: 5}))
    //         .pipe(gulp.dest(dir + '/' + 'asset/img'));
    // });

    // less handle
    gulp.task(project + 'less', [project + 'cleancss'], function () {
        var lesspath = paths.lessDest;
        if (config[project].less && config[project].less == 'single') {
            lesspath = paths.less;
        }
        gulp.src(dir + '/' + lesspath)
            .pipe(less())
            .pipe(gulp.dest(dir + '/' + 'asset/css'));
    });

    // cssmin 
    gulp.task(project + 'cssmin', function () {
        gulp.src([dir + '/' + 'asset/css/*.css'])
            .pipe(rename({suffix: '.min'}))
            .pipe(minifycss())
            .pipe(header(banner, { project: project, nowStr: nowStr } ))
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
        project + 'js', 
        project + 'less'
    ]);

    gulp.task(project + 'build', [
        project + 'uglify', 
        project + 'cssmin'
    ]);
});



// gulp.task('build', (function () {
//     var tasks = [];
//     projects.forEach(function (proj, i) {
//         tasks.push(proj + 'build');
//     });
//     return tasks;
// })());

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