const gulp = require("gulp")
const browserSync = require("browser-sync")
const cp = require("child_process")

gulp.task("browser-sync", function() {
	browserSync({
		server: {
			baseDir: "./build"
		}
	})

	// FIXME: wasteful...
	gulp.watch(["./src/**/*.html", "./src/**/*.js"], ['build'])
	gulp.watch(["./build/**/*.html", "./build/**/*.js"]).on('change', browserSync.reload)
})

gulp.task("build", function() {
	gulp.src("./src/index.html").pipe(gulp.dest("./build/"))
	gulp.src("./src/assets/js/index.js").pipe(gulp.dest("./build/assets/js"))

	gulp.src("./src/assets/js/components/*.js").pipe(gulp.dest("./build/assets/js/components"))
	gulp.src("./src/assets/js/filters/*.js").pipe(gulp.dest("./build/assets/js/filters"))
	gulp.src("./src/assets/js/mixins/*.js").pipe(gulp.dest("./build/assets/js/mixins"))
})

gulp.task("default", ["build", "browser-sync"])

