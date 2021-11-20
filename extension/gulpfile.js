const del = require('del');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const minify = require('gulp-minify');
const open = require('gulp-open');
const prettier = require('gulp-prettier');
const os = require('os');
const zip = require('gulp-zip');

const included_modules = [
    'node_modules/monaco-editor/min/**/*',
    'node_modules/monaco-editor/LICENSE',
    'node_modules/requirejs/require.js',
    'node_modules/portal-unleashed/dist/unleash.js',
    'node_modules/portal-unleashed/dist/unleash.d.ts'
];
const test_modules = [
    'node_modules/jasmine-core/lib/jasmine-core/boot.js',
    'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
    'node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
    'node_modules/jasmine-core/lib/jasmine-core/jasmine.css',
    'node_modules/sinon-chrome/bundle/sinon-chrome.min.js'
];

gulp.task('clean-test', function() {
    return del(['tests/**/*', '!tests/spec/**', '!tests/SpecRunner.html']);
});

gulp.task('clean-build', function() {
    return del(['build/**/*']);
});

gulp.task('clean', gulp.series('clean-test', 'clean-build'));

gulp.task('minify-sources', function() {
    return gulp
        .src('src/**/*')
        .pipe(
            minify({
                noSource: true,
                ext: {
                    min: '.js'
                }
            })
        )
        .pipe(gulp.dest('build'));
});

gulp.task('include-minified-modules', function() {
    return gulp
        .src(included_modules, {
            base: 'node_modules'
        })
        .pipe(
            minify({
                noSource: true,
                ext: {
                    min: '.js'
                },
                exclude: ['monaco-editor'], // Already minified.
                preserveComments: 'some' // Preserve licensing information in require.js.
            })
        )
        .pipe(gulp.dest('build/lib'));
});

gulp.task('produce-zip', function() {
    return gulp.src('build/**/*').pipe(zip('bfportalunchained.zip')).pipe(gulp.dest('build'));
});

gulp.task('copy-test-modules', function() {
    return gulp
        .src(test_modules, {
            base: 'node_modules'
        })
        .pipe(gulp.dest('tests'));
});

gulp.task('run-tests-chrome', function() {
    const browser =
        os.platform() === 'linux' ?
        'google-chrome' :
        os.platform() === 'darwin' ?
        'google chrome' :
        'chrome';
    return gulp.src('./tests/SpecRunner.html').pipe(
        open({
            app: browser
        })
    );
});

gulp.task('run-tests-firefox', function() {
    return gulp.src('./tests/SpecRunner.html').pipe(
        open({
            app: 'firefox'
        })
    );
});

gulp.task('test', gulp.series('clean-test', 'copy-test-modules', 'run-tests-chrome'));

gulp.task('test-firefox', gulp.series('clean', 'copy-test-modules', 'run-tests-firefox'));

gulp.task(
    'build',
    gulp.series('clean-build', 'minify-sources', 'include-minified-modules', 'produce-zip')
);

gulp.task('lint-src', function() {
    return gulp
        .src('src/**/*.js')
        .pipe(eslint('.eslintrc.json'))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint-test', function() {
    return gulp
        .src(['tests/**.js', '!tests/sinon-chrome/**', '!tests/jasmine-core/**'])
        .pipe(eslint('tests/.eslintrc.json'))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint', gulp.series('lint-src', 'lint-test'));

gulp.task('prettify', function() {
    return gulp
        .src(['src/**/*.js', 'tests/**/*.js', 'gulpfile.js'])
        .pipe(prettier({ printWidth: 120 }))
        .pipe(gulp.dest(file => file.base));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series('build'));