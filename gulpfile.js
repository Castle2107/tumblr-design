let gulp = require('gulp');
let gutil =  require('gulp-util');
let sass = require('gulp-sass');
let webserver = require('gulp-webserver');
let path = require('path');
let postcss = require('gulp-postcss');
let reporter = require('postcss-reporter');
let syntax_scss = require('postcss-scss');
let stylelint = require('stylelint');

/* tasks */
// gulp.task(
//   name : String,
//   deps : [] :: optional,
//   cb : fn
// )

/* Styles task */
gulp.task('styles', () => {
  return gulp.src('src/scss/main.scss')
    .pipe(sass({includePaths: [
      path.join(__dirname, 'node_modules/bootstrap/scss/'),
      path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/scss/'),
      path.join(__dirname, 'src/scss')],
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('dist/css/'))
});

/**
 * Copies every html file on src directory to dist directory
 */
gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist/'))
});

/**
 * Watches for changes on every scss and html file on src directory
 */
gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', ['styles'], cb => cb)
  gulp.watch('src/**/*.html', ['html'], cb => cb)
});

/**
 * Runs the server for index file on dist
 */
gulp.task('server', () => {
  gulp.src('dist/')
    .pipe(webserver({
      livereload: true,
      open: true,
    }))
});

/**
 * Applies lint rules
 */
gulp.task("scss-lint", () => {

  // Stylelint config rules
  const stylelintConfig = {
    rules: {
      'at-rule-empty-line-before': ['always', {
        except: ['blockless-after-blockless'],
        ignore: ['after-comment'],
      }],
      'at-rule-name-case': 'lower',
      'at-rule-name-space-after': 'always-single-line',
      'at-rule-no-unknown': true,
      'at-rule-semicolon-newline-after': 'always',
      'block-closing-brace-newline-after': 'always',
      'block-closing-brace-newline-before': 'always',
      'block-opening-brace-newline-after': 'always',
      'block-opening-brace-space-before': 'always',
      'color-hex-case': 'lower',
      'color-hex-length': 'short',
      'color-named': 'never',
      'comment-empty-line-before': ['always', {
        ignore: ['stylelint-commands'],
      }],
      'declaration-bang-space-after': 'never',
      'declaration-bang-space-before': 'always',
      'declaration-block-no-duplicate-properties': [true, {
        ignore: ['consecutive-duplicates'],
      }],
      'declaration-block-semicolon-newline-after': 'always',
      'declaration-block-semicolon-space-before': 'never',
      'declaration-block-trailing-semicolon': 'always',
      'declaration-colon-newline-after': 'always-multi-line',
      'declaration-colon-space-after': 'always-single-line',
      'declaration-colon-space-before': 'never',
      'declaration-property-unit-whitelist': {
        'line-height': ['px'],
      },
      'font-family-name-quotes': 'always-where-recommended',
      'font-weight-notation': ['named-where-possible', {
        ignore: ['relative'],
      }],
      'function-comma-space-after': 'always',
      'function-comma-space-before': 'never',
      'function-max-empty-lines': 1,
      'function-name-case': ['lower', {
        ignoreFunctions: ['/^DXImageTransform.Microsoft.*$/'],
      }],
      'function-parentheses-space-inside': 'never',
      'function-url-quotes': 'never',
      'function-whitespace-after': 'always',
      indentation: 2, //this is for JetBrains IDE'S default identation.
      'length-zero-no-unit': false,
      'max-empty-lines': 2,
      'max-line-length': [80, {
        ignore: 'non-comments',
        ignorePattern: ['/(https?://[0-9,a-z]*.*)|(^description\\:.+)|(^tags\\:.+)/i'],
      }],
      'media-feature-colon-space-after': 'always',
      'media-feature-colon-space-before': 'never',
      'media-feature-range-operator-space-after': 'always',
      'media-feature-range-operator-space-before': 'always',
      'media-query-list-comma-newline-after': 'always-multi-line',
      'media-query-list-comma-space-after': 'always-single-line',
      'media-query-list-comma-space-before': 'never',
      'no-eol-whitespace': true,
      'no-missing-end-of-source-newline': true,
      'number-leading-zero': 'always',
      'number-no-trailing-zeros': true,
      'property-case': 'lower',
      'rule-empty-line-before': ['always', {
        ignore: ['after-comment'],
      }],
      'selector-attribute-brackets-space-inside': 'never',
      'selector-attribute-operator-space-after': 'never',
      'selector-attribute-operator-space-before': 'never',
      'selector-attribute-quotes': 'always',
      'selector-class-pattern': [
        '^[a-z]+(-[a-z]+)*',
        {
          message: 'Selector should use lowercase and separate words with hyphens (selector-class-pattern)',
        },
      ],
      'selector-id-pattern': [
        '^[a-z]+(-[a-z]+)*',
        {
          message: 'Selector should use lowercase and separate words with hyphens (selector-id-pattern)',
        },
      ],
      'selector-combinator-space-after': 'always',
      'selector-combinator-space-before': 'always',
      'selector-list-comma-newline-after': 'always',
      'selector-list-comma-space-before': 'never',
      'selector-max-empty-lines': 0,
      'selector-pseudo-class-case': 'lower',
      'selector-pseudo-class-parentheses-space-inside': 'never',
      'selector-pseudo-element-case': 'lower',
      'selector-pseudo-element-colon-notation': 'double',
      'selector-type-case': 'lower',
      'string-quotes': 'double',
      'unit-case': 'lower',
      'value-keyword-case': 'lower',
      'value-list-comma-newline-after': 'always-multi-line',
      'value-list-comma-space-after': 'always-single-line',
      'value-list-comma-space-before': 'never',
    } //taken from: https://github.com/WordPress-Coding-Standards/stylelint-config-wordpress/blob/master/index.js
  };

let processors = [
  stylelint(stylelintConfig),
  reporter({
    clearMessages: false,
    // throwError: true
  })
];

return gulp.src(
  ['src/scss/**/*.scss',
    '!src/scss/vendor/**/*.scss']
  )
  .pipe(postcss(processors, { syntax: syntax_scss }));
});


/**
 * Copies font awesome webfonts into dist folder
 */
gulp.task('fonts', () => {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('dist/webfonts/'));
});

/**
 * js files
 */
gulp.task('js', () => {
  return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
  ])
  .pipe(gulp.dest('dist/js/'));
});


/**
 * Runs all the tasks
 */
gulp.task('dev', [
  'scss-lint',
  'html',
  'fonts',
  'js',
  'styles',
  'server',
  'watch'
], cb => cb);

/**
 * Build for production
 */
gulp.task('build', [
  'html',
  'fonts',
  'js',
  'styles',
], cb => cb);