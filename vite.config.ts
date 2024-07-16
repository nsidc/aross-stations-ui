import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // We use this for "absolute imports":
    tsconfigPaths(),

    // Lint and typecheck at dev build-time 
    checker({
      typescript: {buildMode: true},
      eslint: {
        lintCommand: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      },
    }),
  ],
})
