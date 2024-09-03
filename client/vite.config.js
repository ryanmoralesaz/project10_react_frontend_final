import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use path.resolve to get the current working directory
  const env = loadEnv(mode, path.resolve(process.cwd()), '')

  return {
    define: {
      'import.meta.env': env
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})