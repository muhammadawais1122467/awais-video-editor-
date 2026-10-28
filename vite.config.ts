import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { buildHomeHead } from './src/seo/head.ts'

/** Injects title/meta/JSON-LD generated from src/content into index.html. */
function seoHead(siteUrl: string): Plugin {
  return {
    name: 'seo-head',
    // Fonts are deliberately not preloaded: on slow mobile connections the 90 KB variable font
    // competed with the hero poster and cost more LCP than the small swap shift it saved.
    transformIndexHtml: (html) => html.replace('<!--app-head-->', `<!--head:start-->\n    ${buildHomeHead(siteUrl)}\n    <!--head:end-->`),
  }
}

/**
 * Dev-only helper: lets the browser save generated media (hero poster,
 * social image, local test clips) into the project. Never part of a build.
 */
function devMediaWriter(): Plugin {
  const allowed = ['public/media/', 'dev-fixtures/']
  return {
    name: 'dev-media-writer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__dev/save', (req, res) => {
        const target = new URL(req.url ?? '', 'http://x').searchParams.get('path') ?? ''
        const normalized = path.posix.normalize(target)
        if (req.method !== 'POST' || normalized.includes('..') || !allowed.some((p) => normalized.startsWith(p))) {
          res.statusCode = 400
          return res.end('bad request')
        }
        const chunks: Buffer[] = []
        req.on('data', (c: Buffer) => chunks.push(c))
        req.on('end', () => {
          const file = path.resolve(server.config.root, normalized)
          fs.mkdirSync(path.dirname(file), { recursive: true })
          fs.writeFileSync(file, Buffer.concat(chunks))
          res.end(`saved ${normalized}`)
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // '/' for a root domain; '/repo-name/' for GitHub project pages (set VITE_BASE in the deploy workflow).
    base: env.VITE_BASE || '/',
    plugins: [react(), seoHead(env.VITE_SITE_URL ?? ''), devMediaWriter()],
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1200,
    },
  }
})
