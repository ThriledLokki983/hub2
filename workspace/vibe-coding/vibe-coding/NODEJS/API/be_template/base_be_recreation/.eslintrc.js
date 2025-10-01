module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors.
    'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', 'coverage', 'logs'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_+' }], // Warn about unused vars, except those starting with _
    'prettier/prettier': ['error', { endOfLine: 'auto' }], // Enforce Prettier rules, auto-detect line endings
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Warn about console logs in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Warn about debugger statements in production
  },
};
