module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended', 'plugin:storybook/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', '**/*.test.ts', '**/*.test.tsx', '**/test/**', '**/stories/**', '**/*.stories.ts', '**/*.stories.tsx'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error', // Add prettier rule
  },
}