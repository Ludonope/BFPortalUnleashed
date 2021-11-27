const del = require("del");
const gulp = require("gulp");
const minify = require("gulp-minify");

const included_modules = [
    "node_modules/monaco-editor/min/**/*",
    "node_modules/monaco-editor/LICENSE",
    "node_modules/requirejs/require.js",
    "node_modules/portal-unleashed/dist/unleash.js",
    "node_modules/portal-unleashed/dist/unleash.d.ts"
];

gulp.task("clean-build", function() {
    return del(["build/**/*"]);
});

gulp.task("copy-sources", function() {
    return gulp
        .src("src/**/*")
        .pipe(gulp.dest("build"));
});

gulp.task("minify-sources", function() {
    return gulp
        .src("src/**/*")
        .pipe(
            minify({
                noSource: true,
                ext: {
                    min: ".js"
                }
            })
        )
        .pipe(gulp.dest("build"));
});

gulp.task("include-minified-modules", function() {
    return gulp
        .src(included_modules, {
            base: "node_modules"
        })
        .pipe(
            minify({
                noSource: true,
                ext: {
                    min: ".js"
                },
                exclude: ["monaco-editor"], // Already minified.
                preserveComments: "some" // Preserve licensing information in require.js.
            })
        )
        .pipe(gulp.dest("build/lib"));
});

gulp.task("build", gulp.series("clean-build", "minify-sources", "include-minified-modules"));
gulp.task("watch", function () {
    gulp.watch("src/**/*", gulp.series(["copy-sources"]));
});