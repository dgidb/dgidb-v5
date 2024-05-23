// The env is development during local development, so it overrides all the rules to "warn"
// The env will be undefined for GH actions or when yarn lint-staged gets fired during pre-commit hooks,
// so we can still catch any violations there
const env = process.env.NODE_ENV;

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['react-app', 'react-app/jest', 'eslint:recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-unused-modules': 'off',
    '@typescript-eslint/no-unused-vars':
      env === 'development' ? 'warn' : 'error',
    'no-unused-vars': env === 'development' ? 'warn' : 'error',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          env === 'development' ? 'warn' : 'error',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
        ],
      },
    },
    {
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        'no-unused-vars': [
          env === 'development' ? 'warn' : 'error',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
        ],
      },
    },
  ],
};
