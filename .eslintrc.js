module.exports = {
  root: true,
  parser: 'Espree',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'space-before-function-paren': ['error', 'never'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // disable callback error handle
    'handle-callback-err': 'off'
  },
  "env": {
    "es6": true,
    "mocha": true
  },
  "globals": {
    "CONFIG": true,
    "BASE_DIR": true,
    "log4js": true,
    "path": true,
    "omitEmpty": true
  }
}
