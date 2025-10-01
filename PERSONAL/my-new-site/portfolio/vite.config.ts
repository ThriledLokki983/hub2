import { defineConfig } from 'vite';
import path from 'path';

/**
 * Performance-optimized Vite configuration
 * See: https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'build',
    sourcemap: mode === 'development',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        projects: path.resolve(__dirname, 'projects.html'),
        resume: path.resolve(__dirname, 'resume.html')
      },
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'vendor': ['./src/components/utils.ts'],
          'navigation': ['./src/components/navigation.ts', './src/components/header.ts'],
          'pages': ['./src/components/projects.ts', './src/components/experiences.ts', './src/components/about.ts', './src/components/contact.ts']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true
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
  // Performance optimizations
  optimizeDeps: {
    include: ['./src/components/utils.ts']
  },
  esbuild: {
    // Tree shake unused code
    treeShaking: true,
    // Minify identifiers for smaller bundle
    minifyIdentifiers: true,
    // Remove unused imports
    minifySyntax: true,
  }
}));