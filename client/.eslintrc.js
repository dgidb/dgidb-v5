const env = process.env.NODE_ENV;

export default {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['react-app', 'react-app/jest', 'eslint:recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-unused-modules': 'off',
    '@typescript-eslint/no-unused-vars': env === 'development' ? 'warn' : 'error',
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
