# 🚀 Deploy para VPS - FutProBot

Guia completo para atualizar sua VPS com as novas alterações do modo real.

## 📋 Pré-requisitos na VPS

- Node.js 18+ ou Bun instalado
- PostgreSQL ou acesso ao Supabase
- Git configurado
- PM2 ou similar para gerenciar processos

## 🔄 Método 1: Via Git (Recomendado)

### Passo 1: Commitar as alterações localmente

```bash
# No seu ambiente local
git add .
git commit -m "Implementar modo real com API-Football e autenticação"
git push origin main
```

### Passo 2: Na VPS, atualizar o código

```bash
# Conectar na VPS via SSH
ssh usuario@seu-servidor-vps

# Navegar até o diretório do projeto
cd /caminho/para/futbotpro

# Fazer backup do .env atual
cp .env .env.backup

# Parar o servidor (se estiver usando PM2)
pm2 stop futbotpro

# Atualizar código
git pull origin main

# Instalar novas dependências
bun install
# ou
npm install
```

### Passo 3: Atualizar variáveis de ambiente

```bash
# Editar o arquivo .env
nano .env
```

Adicione/atualize as seguintes variáveis:

```env
# Obrigatórias
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"
JWT_SECRET="sua-chave-secreta-minimo-32-caracteres"

# Opcional (já tem padrão)
API_FOOTBALL_KEY="74a6034a3a4aa3556afb41cc0f7f048a"
```

**Gerar JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Passo 4: Executar migrations

```bash
# Gerar Prisma Client
bunx prisma generate

# Executar migrations
bunx prisma migrate deploy
```

### Passo 5: Criar usuários de teste

```bash
bun run db:seed
```

### Passo 6: Build da aplicação

```bash
bun run build
# ou
npm run build
```

### Passo 7: Reiniciar o servidor

```bash
# Com PM2
pm2 restart futbotpro

# Ou iniciar pela primeira vez
pm2 start bun --name futbotpro -- run start

# Salvar configuração do PM2
pm2 save
pm2 startup
```

---

## 🔄 Método 2: Via SCP (Upload Direto)

Se não estiver usando Git na VPS:

### Passo 1: Criar arquivo compactado localmente

```bash
# No seu ambiente local
tar -czf futbotpro-update.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=.env \
  .
```

### Passo 2: Enviar para VPS

```bash
scp futbotpro-update.tar.gz usuario@seu-servidor-vps:/tmp/
```

### Passo 3: Na VPS, extrair e atualizar

```bash
# Conectar na VPS
ssh usuario@seu-servidor-vps

# Navegar até o projeto
cd /caminho/para/futbotpro

# Backup
cp .env .env.backup
pm2 stop futbotpro

# Extrair novos arquivos
tar -xzf /tmp/futbotpro-update.tar.gz

# Restaurar .env
mv .env.backup .env

# Instalar dependências
bun install

# Continuar com passos 3-7 do Método 1
```

---

## 🔄 Método 3: Via rsync (Sincronização)

Mais eficiente para atualizações frequentes:

```bash
# No seu ambiente local
rsync -avz --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env' \
  ./ usuario@seu-servidor-vps:/caminho/para/futbotpro/
```

Depois, seguir passos 3-7 do Método 1 na VPS.

---

## ⚙️ Configuração do PM2 (Recomendado)

Criar arquivo `ecosystem.config.js` no projeto:

```javascript
module.exports = {
  apps: [{
    name: 'futbotpro',
    script: 'bun',
    args: 'run start',
    cwd: '/caminho/para/futbotpro',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Usar PM2:

```bash
# Iniciar
pm2 start ecosystem.config.js

# Monitorar
pm2 monit

# Logs
pm2 logs futbotpro

# Reiniciar
pm2 restart futbotpro
```

---

## 🔧 Nginx (Proxy Reverso)

Configuração recomendada para Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar configuração:

```bash
sudo ln -s /etc/nginx/sites-available/futbotpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 SSL com Certbot (HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática já está configurada
sudo certbot renew --dry-run
```

---

## ✅ Verificação Pós-Deploy

1. **Verificar se o servidor está rodando:**
```bash
pm2 status
curl http://localhost:3000
```

2. **Verificar variáveis de ambiente:**
```bash
# Acessar no navegador
https://seu-dominio.com/env-check
```

3. **Testar autenticação:**
```bash
# Login com usuário de teste
Email: teste@sportbot.com
Senha: Teste@123

# Login admin
Email: admin@sportbot.com
Senha: Admin@123
```

4. **Verificar logs:**
```bash
pm2 logs futbotpro --lines 100
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
bunx prisma generate
bun run build
pm2 restart futbotpro
```

### Erro: "Database connection failed"

```bash
# Verificar DATABASE_URL no .env
cat .env | grep DATABASE_URL

# Testar conexão
bunx prisma db push
```

### Erro: "Port 3000 already in use"

```bash
# Encontrar processo
sudo lsof -i :3000

# Matar processo
pm2 delete futbotpro
# ou
kill -9 PID
```

### Build muito lento

```bash
# Limpar cache
rm -rf .next node_modules
bun install
bun run build
```

---

## 📊 Monitoramento

### Ver uso de recursos:

```bash
pm2 monit
```

### Ver logs em tempo real:

```bash
pm2 logs futbotpro --lines 50 -f
```

### Estatísticas:

```bash
pm2 show futbotpro
```

---

## 🔄 Rollback (Reverter Alterações)

Se algo der errado:

```bash
# Voltar para commit anterior
git reset --hard HEAD~1
bun install
bun run build
pm2 restart futbotpro
```

---

## 📝 Checklist de Deploy

- [ ] Backup do .env atual
- [ ] Git pull ou upload de arquivos
- [ ] Instalar dependências (`bun install`)
- [ ] Atualizar variáveis de ambiente
- [ ] Gerar Prisma Client (`bunx prisma generate`)
- [ ] Executar migrations (`bunx prisma migrate deploy`)
- [ ] Criar usuários de teste (`bun run db:seed`)
- [ ] Build da aplicação (`bun run build`)
- [ ] Reiniciar servidor (`pm2 restart`)
- [ ] Verificar `/env-check`
- [ ] Testar login/dashboard
- [ ] Verificar logs

---

## 🆘 Suporte

Se encontrar problemas:

1. Verificar logs: `pm2 logs futbotpro`
2. Verificar variáveis: `/env-check`
3. Testar migrations: `bunx prisma studio`
4. Verificar build: `bun run build`

---

**Desenvolvido com ❤️ - FutProBot Deploy Guide**
