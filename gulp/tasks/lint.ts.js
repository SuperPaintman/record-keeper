'use strict';
/** Requires */
const path            = require('path');

// Main
const gulp            = require('gulp');
const $               = require('gulp-load-plugins')();

const tslint          = require('tslint');

const TSLint          = require('tslint/lib/lint');
const ESLintCLIEngine = require('eslint').CLIEngine;

// Config
const config          = require('../config.js');
const helps           = require('../helps.js');

/** Constants */
const TASK_NAME = 'lint:ts';
const WATCH_TASK_NAME = `watch:${TASK_NAME}`;

module.exports.TASK_NAME = TASK_NAME;
module.exports.WATCH_TASK_NAME = WATCH_TASK_NAME;

function eslintToTslintFormatter(formatter) {
  const eslintFormatter = ESLintCLIEngine.getFormatter(formatter);

  return class Formatter extends TSLint.Formatters.AbstractFormatter {
    format(failures) {
      const resultsObj = failures
        .sort((a, b) => {
          const res = a.startPosition.lineAndCharacter.line - b.startPosition.lineAndCharacter.line;

          if (res !== 0) {
            return res;
          }

          return a.startPosition.lineAndCharacter.character - b.startPosition.lineAndCharacter.character;
        })
        .reduce((res, failure) => {
          if (!res[failure.sourceFile.fileName]) {
            res[failure.sourceFile.fileName] = [];
          }

          res[failure.sourceFile.fileName].push({
            line:     failure.startPosition.lineAndCharacter.line + 1,
            column:   failure.startPosition.lineAndCharacter.character + 1,
            message:  failure.failure,
            ruleId:   failure.ruleName,
            source:   failure.sourceFile.text,
            fatal:    true
          });

          return res;
        }, {});

      const results = Object.keys(resultsObj)
        .map((key) => ({
          filePath: key,
          messages: resultsObj[key]
        }));

      return eslintFormatter(results);
    }
  };
}

/** Task */
gulp.task(TASK_NAME, () => {
  return gulp.src(config.paths.lint.ts.from)
    // Error handler
    .pipe($.plumber({
      errorHandler: helps.onError
    }))

    // Catch
    .pipe($.cached(TASK_NAME))

    // Eslint
    .pipe($.tslint({
      tslint: tslint,
      configuration: config.tslint,
      formatter: eslintToTslintFormatter()
    }))

    // Remember
    .pipe($.remember(TASK_NAME))

    // Format
    .pipe($.tslint.report())

    ;
});

/** Watch */
gulp.task(WATCH_TASK_NAME, () => {
  return gulp.watch(config.paths.lint.ts.watch, [TASK_NAME])
    .on('unlink', (filepath) => {
      const resolvedFilepath = path.resolve(filepath);

      $.remember.forget(TASK_NAME, resolvedFilepath);
      if ($.cached.caches[TASK_NAME]) {
        delete $.cached.caches[TASK_NAME][resolvedFilepath];
      }
    });
});
