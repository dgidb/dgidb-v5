// The env is development during local development, so it overrides all the rules to "warn"
// The env will be undefined for GH actions or when yarn lint-staged gets fired during pre-commit hooks,
// so we can still catch any violations there
const env = process.env.NODE_ENV;

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    // These were not enforced by the previous CRA lint command; keep this
    // migration focused on tooling rather than unrelated source rewrites.
    'react/jsx-key': 'off',
    'react/no-deprecated': 'off',
    'react/no-unescaped-entities': 'off',
    'import/no-unused-modules': 'off',
    '@typescript-eslint/no-unused-vars':
      env === 'development' ? 'warn' : 'error',
    'no-unused-vars': env === 'development' ? 'warn' : 'error',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          env === 'development' ? 'warn' : 'error',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
        ],
      },
    },
    {
      files: ['.eslintrc.js', 'vite.config.ts'],
      env: { node: true },
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
    {
      files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
      env: { jest: true },
    },
  ],
};
