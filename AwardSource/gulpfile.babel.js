// Load plugins
var gulp = require('gulp'),  //
    sass = require('gulp-sass'),//编译sass文件
    autoprefixer = require('gulp-autoprefixer'),//自动为 css 添加浏览器前缀
    minifycss = require('gulp-minify-css'),//压缩css
	cssnano = require('gulp-cssnano'),//压缩css
    jshint = require('gulp-jshint'),//校验js代码  需要先在项目中安装 jshint，命令 npm install jshint
    concat = require('gulp-concat'),//合并js代码
    uglify = require('gulp-uglify'),//压缩js代码
    imagemin = require('gulp-imagemin'),//压缩图片
	htmlmin = require('gulp-htmlmin'),//压缩html文件
	minifyHtml = require('gulp-minify-html'),//压缩css
    rename = require('gulp-rename'),//重命名文件
    notify = require('gulp-notify'),//更改提醒
    cache = require('gulp-cache'),//图片缓存，只有图片替换了才压缩
    livereload = require('gulp-livereload');//自动刷新页面
	clean = require('gulp-clean');
	
gulp.task('styles',function(){
	return gulp.src('app/css/*.css') //要处理的文件
	//自动为css样式添加浏览器前缀
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	//合并成一个main.css
	//.pipe(concat('main.css'))
	//压缩css
	.pipe(minifycss())
	//.pipe(cssnano())
	//重命名 中间加入 min
	//.pipe(rename({suffix:'.min'}))
	//文件输出至指定目录
	.pipe(gulp.dest('_dist/css'))
	//输出任务完成信息
	//.pipe(notify({message:'------------------- styles task complete --------------------------'}))
});

gulp.task('scripts',function(){
	return gulp.src('app/js/*.js')
	//校验js代码
	.pipe(jshint())
	//报告js代码错误信息
	.pipe(jshint.reporter('default'))
	//合并成一个 main.js
	//.pipe(concat('main.js'))
	//压缩js代码
	.pipe(uglify())
	//重命名为 main.min.js
	//.pipe(rename({suffix:'.min'}))
	//文件输出至指定目录
	.pipe(gulp.dest('_dist/js'))
	//输出任务完成信息
	//.pipe(notify({message:'------------------- scripts task complete --------------------------'}))
});

gulp.task('images',function(){
	return gulp.src('app/images/*')
	//压缩图片
	.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
	//文件输出至指定目录
	.pipe(gulp.dest('_dist/images'))
	//输出任务完成信息
	//.pipe(notify({message:'------------------- images task complete --------------------------'}))
});

gulp.task('fonts',function(){
	return gulp.src('app/css/font/*/*')
	//文件输出至指定目录
	.pipe(gulp.dest('_dist/css/font/'))
	//输出任务完成信息
	//.pipe(notify({message:'------------------- fonts task complete --------------------------'}))
});

gulp.task('html',function(){
	
	var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
	
	return gulp.src('app/html/*.html')
	//.pipe(rename('index.html'))
	.pipe(minifyHtml())
	.pipe(htmlmin(options))
	.pipe(gulp.dest('_dist/html'))
	//输出任务完成信息
	//.pipe(notify({message:'------------------- html task complete --------------------------'}))
});

gulp.task('clean',function(){
	return gulp.src('_dist/*',{read:false})
		.pipe(clean())
})
//任务合并
gulp.task('build',['styles','scripts','images','fonts','html']);


gulp.task('default',['clean'],function(){
	gulp.start('build');
})