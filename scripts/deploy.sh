#!/bin/bash

# Script de Deploy - Sistema CEPIN
# Este script ajuda a fazer o deploy do sistema na Vercel

echo "🚀 Iniciando deploy do Sistema CEPIN..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "🔐 Fazendo login na Vercel..."
    vercel login
fi

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Deploy
echo "🚀 Fazendo deploy..."
vercel --prod

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://seu-projeto.vercel.app"


