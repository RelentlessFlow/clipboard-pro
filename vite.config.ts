import path, { join } from 'path';
import react from '@vitejs/plugin-react';
import { UserConfig, ConfigEnv } from 'vite';
import { vitePluginForArco } from '@arco-plugins/vite-react'
import alias from "@rollup/plugin-alias";
import resolve from "rollup-plugin-node-resolve";

const srcRoot = path.resolve(__dirname, "./src");
const etRoot = path.resolve(__dirname, "./electron");

export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === 'serve') {
    return {
      root: srcRoot,
      base: '/',
      plugins: [
        alias(),
        react(),
        vitePluginForArco({
          style: false
        }),
      ],
      resolve: {
        alias: {
          "@": srcRoot,
          "@electron": etRoot
        }
      },
      build: {
        outDir: join(srcRoot, '/out'),
        emptyOutDir: true,
        rollupOptions: {
          plugins: [
            resolve()
          ]
        }
      },
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT
      },
      optimizeDeps: {
        exclude: ['path']
      },
    };
  }
  // PROD
  return {
    root: srcRoot,
    base: './',
    plugins: [react()],
    resolve: {
      alias: {
        '/@': srcRoot,
      }
    },
    build: {
      outDir: join(srcRoot, '/out'),
      emptyOutDir: true,
      rollupOptions: {}
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
    },
    optimizeDeps: {
      exclude: ['path']
    }
  };
};
