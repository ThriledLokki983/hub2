import { defineConfig } from 'vite';
import path from 'path';

/**
 * See: https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'build',
    sourcemap: true,
  },
	resolve: {
    alias: [
      { find: 'assets', replacement: path.resolve(__dirname, './src/assets') },
      { find: 'components', replacement: path.resolve(__dirname, './src/components') },
		],
	},
	server: {
		port: 3000,
	},
}));