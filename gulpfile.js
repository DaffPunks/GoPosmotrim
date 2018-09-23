/*
 * Gulp dependencies
 */
const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const sass          = require('gulp-sass');
const cleanCSS      = require('gulp-clean-css');
const autoprefixer  = require('gulp-autoprefixer');
const babel         = require('gulp-babel');
const minify        = require('gulp-minify');
const imagemin      = require('gulp-imagemin');

/*
 * Configuration
 */
const config = {
    source: './assets',
    output: './public',
};


gulp.task('scss', () =>
    gulp.src(config.source + '/scss/**.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.output + '/css'))
);

gulp.task('js', () =>
    gulp.src(config.source + '/js/**.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest(config.output + '/js'))
);

gulp.task('images', () =>
    gulp.src(config.source + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.output + '/images'))
);

gulp.task('favicon', () =>
    gulp.src(config.source + '/favicon/*')
        .pipe(gulp.dest(config.output + '/favicon'))
);

gulp.task('watch', ['js', 'scss'], () => {
    gulp.watch(config.source + '/scss/**/*.scss', ['scss']);
    gulp.watch(config.output + 'js/*.js', ['js']);
});

gulp.task('build', ['scss', 'js', 'images', 'favicon']);
gulp.task('default', ['build', 'watch']);
