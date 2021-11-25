import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

const viteEnv = {}
Object.keys(process.env).forEach((key) => {
  if (key.startsWith(`VITE_`)) {
    viteEnv[`import.meta.env.${key}`] = process.env[key]
  }
})

// https://vitejs.dev/config/
export default defineConfig({
 /*  alias: {
    '@': require('path').resolve(__dirname, 'src')
  }, */
  define: viteEnv,
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, './src/i18n/locales/**'),
    })
  ]
})


