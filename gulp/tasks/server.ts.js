'use strict';
/** Requires */
const path          = require('path');

// Main
const gulp          = require('gulp');
const $             = require('gulp-load-plugins')();

const _             = require('lodash');
const typescript    = require('typescript');

// Config
const config        = require('../config.js');

/** Constants */
const TASK_NAME = 'server:ts';
const WATCH_TASK_NAME = `watch:${TASK_NAME}`;

module.exports.TASK_NAME = TASK_NAME;
module.exports.WATCH_TASK_NAME = WATCH_TASK_NAME;

/** Task */
gulp.task(TASK_NAME, () => {
  return gulp.src(config.paths.server.ts.from)
    // Error handler
    /** @todo  Breaks typescript error emit */
    // .pipe($.plumber({
    //   errorHandler: helps.onError
    // }))

    // Catch
    // .pipe($.cached(TASK_NAME))

    // Source map
    .pipe($.sourcemaps.init())

    // TS render
    .pipe($.typescript(
      _.merge({
        typescript: typescript
      }, config.ts.server.compilerOptions),
      $.typescript.reporter.longReporter()
    ))

    // Babel render
    .pipe($.babel(config.babel.server))

    //End source map
    .pipe($.sourcemaps.write())

    // Сохранение
    .pipe(gulp.dest(config.paths.server.ts.to))

    ;
});

/** Watch */
gulp.task(WATCH_TASK_NAME, () => {
  return gulp.watch(config.paths.server.ts.watch, [TASK_NAME])
    .on('unlink', (filepath) => {
      const resolvedFilepath = path.resolve(filepath);

      if ($.cached.caches[TASK_NAME]) {
        delete $.cached.caches[TASK_NAME][resolvedFilepath];
      }
    });
});
