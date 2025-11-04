module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react-native/no-inline-styles': 'off'
  }
};
