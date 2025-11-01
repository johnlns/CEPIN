/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@libsql/client']
}

// Evitar que o webpack tente carregar arquivos não JS como README.md de @libsql/client
// e garantir que módulos Node não sejam empacotados no middleware/edge
nextConfig.webpack = (config) => {
  // Ignora qualquer README.md dentro de node_modules no bundle
  config.module.rules.push({
    test: /README\.md$/,
    type: 'asset/source',
    include: /node_modules\/[@.]?libsql/,
  })

  return config
}

module.exports = nextConfig
