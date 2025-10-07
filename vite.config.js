import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tsconfigPaths()],
    test: {
      globals: true,
      environment: "jsdom",
    },
    base: env.VITE_PUBLIC_BASE ?? '/',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.frag', '**/*.vert', '**/*.glsl'],
  };
});