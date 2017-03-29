var gulp = require('gulp')
var mocha = require('gulp-mocha')
var nodemon = require('gulp-nodemon')
var env = require('gulp-env');

gulp.task('API-Server', (cb) => {
  let started = false

  env({
    vars: {
      httpPort: 8080
    }
  });

  return nodemon({
    script: 'index.js'
  })
    .on('start', () => {
      if (!started) {
        started = true
        return cb()
      }
    })
    .on('restart', () => {
      console.log('restarting')
    })

})

gulp.task('test', ['API-Server'], function() {
  return gulp.src('./test/index.js')
    .pipe(mocha())
    .once('error', function() {
      process.exit(1)
    })
    .once('end', function() {
      process.exit()
    })
})
