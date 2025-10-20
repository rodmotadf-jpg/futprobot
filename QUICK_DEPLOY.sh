#!/bin/bash

echo "🚀 FutProBot - Deploy Rápido para VPS"
echo "========================================"
echo ""

read -p "Digite o usuário SSH da VPS: " SSH_USER
read -p "Digite o IP/domínio da VPS: " SSH_HOST
read -p "Digite o caminho do projeto na VPS (ex: /var/www/futbotpro): " PROJECT_PATH

echo ""
echo "📦 Preparando arquivos para deploy..."

tar -czf futbotpro-deploy.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=.env \
  --exclude=futbotpro-deploy.tar.gz \
  .

echo "✅ Arquivo compactado criado!"
echo ""
echo "📤 Enviando para VPS..."

scp futbotpro-deploy.tar.gz $SSH_USER@$SSH_HOST:/tmp/

echo ""
echo "🔧 Executando deploy na VPS..."

ssh $SSH_USER@$SSH_HOST << EOF
  echo "📍 Navegando para o projeto..."
  cd $PROJECT_PATH

  echo "💾 Fazendo backup do .env..."
  cp .env .env.backup

  echo "⏸️  Parando servidor..."
  pm2 stop futbotpro || true

  echo "📦 Extraindo novos arquivos..."
  tar -xzf /tmp/futbotpro-deploy.tar.gz

  echo "🔄 Restaurando .env..."
  mv .env.backup .env

  echo "📚 Instalando dependências..."
  bun install

  echo "🔨 Gerando Prisma Client..."
  bunx prisma generate

  echo "🗃️  Executando migrations..."
  bunx prisma migrate deploy

  echo "🏗️  Fazendo build..."
  bun run build

  echo "▶️  Reiniciando servidor..."
  pm2 restart futbotpro || pm2 start bun --name futbotpro -- run start
  pm2 save

  echo "🧹 Limpando arquivos temporários..."
  rm /tmp/futbotpro-deploy.tar.gz

  echo ""
  echo "✅ Deploy concluído com sucesso!"
  echo ""
  echo "📊 Status do servidor:"
  pm2 status futbotpro
EOF

echo ""
echo "🧹 Limpando arquivo local..."
rm futbotpro-deploy.tar.gz

echo ""
echo "✨ Deploy finalizado!"
echo ""
echo "🔗 Acesse: http://$SSH_HOST"
echo "📊 Verificar variáveis: http://$SSH_HOST/env-check"
echo ""
echo "📋 Credenciais de teste:"
echo "   Usuário: teste@sportbot.com / Teste@123"
echo "   Admin: admin@sportbot.com / Admin@123"
echo ""
