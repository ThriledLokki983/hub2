import { defineConfig } from 'vite'
import fs from 'fs/promises';
import https from 'https';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
      'process.env': {
        REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL),
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8"),
              }));
            },
          },
        ],
      },
    },
    server: {
        proxy: {
            '/api': {
              target: 'http://localhost:4001',
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace('api', ''),
              // agent: new https.Agent(),
              configure: (proxy, _options) => {
                  // proxy.on('error', (err, _req, _res) => {
                  //   console.log('proxy error', err);
                  // });

                  proxy.on('proxyReq', (proxyReq, _req, _res) => {
                    console.log('proxyReq', proxyReq);
                  });

                  // proxy.on('proxyRes', (proxyRes, _req, _res) => {
                  //   console.log('proxyRes', proxyRes);
                  // });
              },
          },
        }
    }
})
