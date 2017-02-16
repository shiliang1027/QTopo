var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var concat = require('gulp-concat');//合并
var uglify = require('gulp-uglify');//压缩
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
//合并压缩依赖的js
var yilaiJs=['public/lib/jquery/jquery.min.js','public/lib/flat-ui/js/flat-ui.min.js'];
gulp.task("concatJs",function(){
    gulp.src(yilaiJs).pipe(concat('concat.js')).pipe(uglify()).pipe(gulp.dest('./public/lib/concat'));
});
//合并压缩依赖的css
var yilaiCss=["public/lib/flat-ui/css/flat-ui.min.css"];
gulp.task('concatCss', function() {                                //- 创建一个名为 concat 的 task
    gulp.src(yilaiCss)                                          //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('concat.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(gulp.dest('./public/lib/concat/css'));                         //- 输出文件本地
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