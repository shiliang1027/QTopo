var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var webpack = require('gulp-webpack');
var homePage = "./public/index.html";
var scss = "./develop/scss/Qtopo.scss";
var dCss = "./public/css/";
var root = './public';
var watchPath = ["develop/*.js",'develop/**/*.js',"./webpack.config.js"];

gulp.task('default', ['watch', 'serve']);
gulp.task('webpack', function () {
    return gulp.src('./develop/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./public/qtopo')).pipe(connect.reload());
});
gulp.task('reload', function () {
    gulp.src(homePage).pipe(connect.reload());
});
gulp.task('sass', function (done) {
    gulp.src(scss)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest(dCss))
        .pipe(minifyCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest(dCss))
        .pipe(connect.reload())
        .on('end', done);
});
gulp.task('watch', function () {
    gulp.watch(homePage, ['reload']);
    gulp.watch(scss, ['sass']);
    gulp.watch(watchPath, ['webpack']);
});
//服务器任务，提供在线查看功能
gulp.task('serve', function () {
    connect.server({
        root: root,
        fallback: homePage,
        port: 8090,
        livereload: true
    });
});