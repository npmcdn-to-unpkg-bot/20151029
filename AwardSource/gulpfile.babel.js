// Load plugins
var gulp = require('gulp'),  //
    sass = require('gulp-sass'),//����sass�ļ�
    autoprefixer = require('gulp-autoprefixer'),//�Զ�Ϊ css ��������ǰ׺
    minifycss = require('gulp-minify-css'),//ѹ��css
	cssnano = require('gulp-cssnano'),//ѹ��css
    jshint = require('gulp-jshint'),//У��js����  ��Ҫ������Ŀ�а�װ jshint������ npm install jshint
    concat = require('gulp-concat'),//�ϲ�js����
    uglify = require('gulp-uglify'),//ѹ��js����
    imagemin = require('gulp-imagemin'),//ѹ��ͼƬ
	htmlmin = require('gulp-htmlmin'),//ѹ��html�ļ�
	minifyHtml = require('gulp-minify-html'),//ѹ��css
    rename = require('gulp-rename'),//�������ļ�
    notify = require('gulp-notify'),//��������
    cache = require('gulp-cache'),//ͼƬ���棬ֻ��ͼƬ�滻�˲�ѹ��
    livereload = require('gulp-livereload');//�Զ�ˢ��ҳ��
	clean = require('gulp-clean');
	
gulp.task('styles',function(){
	return gulp.src('app/css/*.css') //Ҫ������ļ�
	//�Զ�Ϊcss��ʽ��������ǰ׺
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	//�ϲ���һ��main.css
	//.pipe(concat('main.css'))
	//ѹ��css
	.pipe(minifycss())
	//.pipe(cssnano())
	//������ �м���� min
	//.pipe(rename({suffix:'.min'}))
	//�ļ������ָ��Ŀ¼
	.pipe(gulp.dest('_dist/css'))
	//������������Ϣ
	//.pipe(notify({message:'------------------- styles task complete --------------------------'}))
});

gulp.task('scripts',function(){
	return gulp.src('app/js/*.js')
	//У��js����
	.pipe(jshint())
	//����js���������Ϣ
	.pipe(jshint.reporter('default'))
	//�ϲ���һ�� main.js
	//.pipe(concat('main.js'))
	//ѹ��js����
	.pipe(uglify())
	//������Ϊ main.min.js
	//.pipe(rename({suffix:'.min'}))
	//�ļ������ָ��Ŀ¼
	.pipe(gulp.dest('_dist/js'))
	//������������Ϣ
	//.pipe(notify({message:'------------------- scripts task complete --------------------------'}))
});

gulp.task('images',function(){
	return gulp.src('app/images/*')
	//ѹ��ͼƬ
	.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
	//�ļ������ָ��Ŀ¼
	.pipe(gulp.dest('_dist/images'))
	//������������Ϣ
	//.pipe(notify({message:'------------------- images task complete --------------------------'}))
});

gulp.task('fonts',function(){
	return gulp.src('app/css/font/*/*')
	//�ļ������ָ��Ŀ¼
	.pipe(gulp.dest('_dist/css/font/'))
	//������������Ϣ
	//.pipe(notify({message:'------------------- fonts task complete --------------------------'}))
});

gulp.task('html',function(){
	
	var options = {
        removeComments: true,//���HTMLע��
        collapseWhitespace: true,//ѹ��HTML
        collapseBooleanAttributes: true,//ʡ�Բ������Ե�ֵ <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//ɾ�����пո�������ֵ <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//ɾ��<script>��type="text/javascript"
        removeStyleLinkTypeAttributes: true,//ɾ��<style>��<link>��type="text/css"
        minifyJS: true,//ѹ��ҳ��JS
        minifyCSS: true//ѹ��ҳ��CSS
    };
	
	return gulp.src('app/html/*.html')
	//.pipe(rename('index.html'))
	.pipe(minifyHtml())
	.pipe(htmlmin(options))
	.pipe(gulp.dest('_dist/html'))
	//������������Ϣ
	//.pipe(notify({message:'------------------- html task complete --------------------------'}))
});

gulp.task('clean',function(){
	return gulp.src('_dist/*',{read:false})
		.pipe(clean())
})
//����ϲ�
gulp.task('build',['styles','scripts','images','fonts','html']);


gulp.task('default',['clean'],function(){
	gulp.start('build');
})