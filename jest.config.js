
module.exports = {
  'testRegex': 'test/.*\\.spec.js$',
  'transform': {
    '^.+\\.js$': ['babel-jest']
  },
  'moduleFileExtensions': ['js'],
  'moduleDirectories': ['node_modules'],
  'reporters': [
    ['jest-nyancat-reporter', {
      'suppressErrorReporter': false
    }]
  ],
  'setupFilesAfterEnv': ['jest-extended']
};
