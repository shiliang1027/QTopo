var gulp = require('gulp');
//var sass = require('gulp-sass');//依赖 node-sass
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var concat = require('gulp-concat');//合并
var uglify = require('gulp-uglify');//压缩
var runSequence=require("run-sequence");//同步执行gulp任务
//var webpack = require('gulp-webpack');
//var homePage = "./public/index.html";
var homePage = "./topo_iposs/index2.html";
var scss = "./develop/scss/Qtopo.scss";
var dCss = "./public/css/";
var root = './topo_iposs';

gulp.task('default', ['watch', 'serve']);
//gulp.task('webpack', function () {
//    return gulp.src('./develop/main.js')
//        .pipe(webpack(require('./webpack.config.js')))
//        .pipe(gulp.dest('./public/qtopo'));
//});
var shell = require('gulp-shell');
gulp.task('webpack', shell.task(['webpack --config webpack.config.js']));
gulp.task('webpack-ready', shell.task(['webpack --config webpack.config.ready.js']));
gulp.task('webpack-doc', shell.task(['webpack --config webpack.config.doc.js']));
gulp.task('build', function(callback) {
    runSequence('webpack',"reload",'copy',callback);
});
gulp.task('ready', function(callback) {
    runSequence('webpack-ready',"concat-ready",callback);
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
//合并压缩依赖的js
var lib = "public/lib/";
var yilaiJs = [lib + 'jquery/jquery.min.js', lib + 'bootstrap-3.3.6-dist/js/bootstrap.js', lib + 'jquery-nicescroll/jquery.nicescroll.min.js'];
//var newwww=["./new/concat.js","./new/qtopo.core.min.js","./new/qtopo.component.min.js"];
gulp.task("concatJs", function () {
    gulp.src(yilaiJs).pipe(concat('concat.js')).pipe(uglify()).pipe(gulp.dest('./public/lib/concat'));
});
var iposs="topo_iposs/qtopo";
gulp.task("concat-ready", function () {
    gulp.src([iposs+'/qtopo.css'])                                          //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('topo.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(gulp.dest("topo_iposs/topo"));
    gulp.src([iposs+"/qtopo.core.min.js",iposs+"/qtopo.component.min.js",iposs+"/qtopo.iposs.min.js"])
        .pipe(concat('topo.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("topo_iposs/topo"));
});
//合并压缩依赖的css
var yilaiCss = [lib + "bootstrap-3.3.6-dist/css/bootstrap.css"];
var neeee=["./concat/concat.css","./concat/qtopo.css","./concat/style.css"];
gulp.task('concatCss', function () {                                //- 创建一个名为 concat 的 task
    gulp.src(neeee)                                          //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('topo.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(gulp.dest('./concat'));                         //- 输出文件本地
});
gulp.task('watch', function () {
    gulp.watch(homePage, ['reload']);
    gulp.watch(scss, ['sass']);
    gulp.watch(["develop/**/*.js","develop/**/*.html","develop/**/*.css","iposs/**/*"], ['build']);
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
gulp.task("copy",function(){
    return gulp.src(['topo_iposs/qtopo/qtopo.component.min.js','topo_iposs/qtopo/qtopo.core.min.js'])
        .pipe(gulp.dest('public/qtopo'));
});
gulp.task("doc",function(){
    connect.server({
        root: "./doc",
        port: 8110,
        livereload: true
    });
    gulp.watch(["./doc/docs/*.js","./doc/**/*.html","./doc/**/*.css"],['build-doc']);
});
gulp.task("doc-reload",function(){
    gulp.src("./doc/index.html").pipe(connect.reload());
});
gulp.task('build-doc', function(callback) {
    runSequence('webpack-doc',"doc-reload",callback);
});