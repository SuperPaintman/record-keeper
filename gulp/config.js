'use strict';
/** Requires */
const fs            = require('fs');
const path          = require('path');

// Utils
const yaml          = require('js-yaml');

/** Constants */
const isProduction  = process.env.NODE_ENV === 'production';
const staticAddr    = process.env.NODE_STATIC_ADDR
                    ? ('' + process.env.NODE_STATIC_ADDR)
                    : '';

const tsServerConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../tsconfig.json'))
);

const babelServerConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../server.babelrc')).toString()
);

const eslintConfig = yaml.load(
  fs.readFileSync(path.join(__dirname, '../.eslintrc.yml')).toString()
);

const tslintConfig = yaml.load(
  fs.readFileSync(path.join(__dirname, '../tslint.yml')).toString()
);

const folders = {
  server: {
    build: '.backend',
    source: 'backend'
  },

  tmp: '.gulp-tmp'
};

const paths = (function () {
  const $p = {};

  /** Server */
  $p.server = {};
  // js
  $p.server.ts = {};
  $p.server.ts.from   = [
    `./${folders.server.source}/**/*.ts`,
    './typings/**/*.ts'
  ];
  $p.server.ts.watch  = [
    `./${folders.server.source}/**/*.ts`,
    './typings/**/*.ts'
  ];
  $p.server.ts.to     = `./${folders.server.build}/`;


  /** Lint */
  $p.lint = {};

  // js
  $p.lint.js = {};
  $p.lint.js.from = [
    `./${folders.server.source}/**/*.js`,
    './gulp/**/*.js',
    './gulpfile.js'
  ];
  $p.lint.js.watch = $p.lint.js.from;

  // ts
  $p.lint.ts = {};
  $p.lint.ts.from = [
    `./${folders.server.source}/**/*.ts`
  ];
  $p.lint.ts.watch = $p.lint.ts.from;

  return $p;
})();

module.exports = {
  isProduction: isProduction,
  staticAddr:   staticAddr,

  folders: folders,

  paths: paths,

  ts: {
    server: tsServerConfig
  },

  babel: {
    server: babelServerConfig
  },

  eslint: eslintConfig,
  tslint: tslintConfig
};
