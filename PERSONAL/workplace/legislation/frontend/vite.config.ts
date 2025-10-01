import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';

import InterfaceGenerator from './scripts/interfaceGenerator';


/**
 * See: https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  plugins: [
    react(),
    svgr(),
    checker({
      enableBuild: false, // Allow CI/CD builds to run regardless of warnings
      overlay: {
        initialIsOpen: false,
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
      // @TODO: Locked with manually added `meow` package.
      // See: https://github.com/fi3ework/vite-plugin-checker/issues/260
      stylelint: {
        lintCommand: 'stylelint ./src/**/*.scss',
      },
      typescript: true,
    }),
    {
      name: 'interface-generator',
      buildStart: () => {
        if (mode !== 'development') {
          return;
        }
        const generator = InterfaceGenerator();
        generator.init();
      },
    },
    // Fixes circular import errors.
    // See: https://github.com/vitejs/vite/issues/3033
    {
      name: 'single-hmr',
      handleHotUpdate({ modules }) {
        modules.map((m) => {
          m.importers = new Set();
        });
        return modules;
      },
    },
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        pxtorem({
          /**
           * @TODO: refactor `:root` to `62.5%` and adjust this to `10`?
           */
          rootValue: 16,
          mediaQuery: true,
          propList: ['*'],
        }),
      ],
    },
  },
  resolve: {
    alias: [
      { find: 'assets', replacement: path.resolve(__dirname, './src/assets') },
      { find: 'components', replacement: path.resolve(__dirname, './src/components') },
      { find: 'configs', replacement: path.resolve(__dirname, './src/configs') },
      { find: 'contexts', replacement: path.resolve(__dirname, './src/contexts') },
      { find: 'data', replacement: path.resolve(__dirname, './src/data') },
      { find: 'helpers', replacement: path.resolve(__dirname, './src/helpers') },
      { find: 'hocs', replacement: path.resolve(__dirname, './src/hocs')},
      { find: 'hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: 'pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: 'stores', replacement: path.resolve(__dirname, './src/stores') },
      { find: 'styles', replacement: path.resolve(__dirname, './src/styles') },
    ],
  },
  preview: {
    open: true,
    port: 3000,
  },
  server: {
    open: true,
    port: 3000,
  },
}));
