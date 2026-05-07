import fs from 'node:fs/promises'

const APP_VERSION_META_RE = /<meta\s+name="app-version"\s+content=".*?"\s*\/?>/
const INDEX_HTML_URL = new URL('../index.html', import.meta.url)

async function run() {
  const version = Date.now().toString()
  const content = await fs.readFile(INDEX_HTML_URL, 'utf8')
  const meta = `<meta name="app-version" content="${version}" />`

  const nextContent = APP_VERSION_META_RE.test(content)
    ? content.replace(APP_VERSION_META_RE, meta)
    : content.replace('<head>', `<head>\n    ${meta}`)

  await fs.writeFile(INDEX_HTML_URL, nextContent, 'utf8')
  console.log('✅ 版本已更新')
}

run()
