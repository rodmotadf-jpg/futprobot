# 🚀 Deploy via Git - Guia Passo a Passo

## 📍 Passo 1: Push para GitHub (Ambiente Local)

```bash
# No seu terminal local (onde está agora)
cd /home/user/project

# Fazer push para o GitHub
git push -u origin main
```

**Se pedir autenticação:**
- Usuário: `muoctar2-jpg`
- Token: Use um Personal Access Token do GitHub
  - Gerar em: https://github.com/settings/tokens
  - Permissões: `repo` (acesso completo)

---

## 📍 Passo 2: Conectar na VPS

```bash
# Conectar via SSH na sua VPS
ssh usuario@seu-servidor-ip
```

---

## 📍 Passo 3: Navegar até o projeto na VPS

```bash
# Ir para o diretório do projeto
cd /caminho/do/seu/projeto/futbotpro

# Exemplo comum:
# cd /var/www/futbotpro
# ou
# cd ~/futbotpro
```

---

## 📍 Passo 4: Fazer backup do .env

```bash
# IMPORTANTE: Fazer backup das variáveis de ambiente
cp .env .env.backup
```

---

## 📍 Passo 5: Parar o servidor

```bash
# Se estiver usando PM2
pm2 stop futbotpro

# Se estiver usando outro método
# sudo systemctl stop futbotpro
# ou kill o processo manualmente
```

---

## 📍 Passo 6: Atualizar o código

```bash
# Puxar as últimas alterações do GitHub
git pull origin main

# Se pedir para resolver conflitos no .env, use:
# git checkout --theirs .env.backup
# git pull origin main --no-rebase
```

---

## 📍 Passo 7: Restaurar .env

```bash
# Restaurar o .env com suas credenciais
cp .env.backup .env
```

---

## 📍 Passo 8: Atualizar .env com novas variáveis

```bash
# Editar o .env
nano .env
```

**Adicionar/verificar estas variáveis:**

```env
# Variáveis OBRIGATÓRIAS (já deve ter)
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"

# Variáveis NOVAS (adicionar se não tiver)
JWT_SECRET="sua-chave-secreta-minimo-32-caracteres"
API_FOOTBALL_KEY="74a6034a3a4aa3556afb41cc0f7f048a"
```

**Para gerar o JWT_SECRET:**
```bash
openssl rand -base64 32
```

Copie o resultado e cole no .env.

**Salvar e sair do nano:**
- `Ctrl + O` (salvar)
- `Enter` (confirmar)
- `Ctrl + X` (sair)

---

## 📍 Passo 9: Instalar novas dependências

```bash
# Se estiver usando Bun
bun install

# Se estiver usando npm
npm install
```

---

## 📍 Passo 10: Gerar Prisma Client

```bash
bunx prisma generate

# ou com npm
npx prisma generate
```

---

## 📍 Passo 11: Executar migrations

```bash
# IMPORTANTE: Isso vai criar as novas tabelas no banco
bunx prisma migrate deploy

# ou com npm
npx prisma migrate deploy
```

---

## 📍 Passo 12: Criar usuários de teste

```bash
# Criar usuários admin e teste
bun run db:seed

# ou com npm
npm run db:seed
```

**Usuários criados:**
- **Usuário Teste**: `teste@sportbot.com` / `Teste@123`
- **Admin**: `admin@sportbot.com` / `Admin@123`

---

## 📍 Passo 13: Build da aplicação

```bash
# Fazer build para produção
bun run build

# ou com npm
npm run build
```

**Este passo pode demorar alguns minutos.**

---

## 📍 Passo 14: Reiniciar o servidor

```bash
# Com PM2
pm2 restart futbotpro

# Se for a primeira vez com PM2:
pm2 start bun --name futbotpro -- run start

# Salvar configuração do PM2 (para reiniciar automaticamente)
pm2 save
pm2 startup
```

---

## ✅ Passo 15: Verificar se está funcionando

### 1. Ver status do PM2
```bash
pm2 status
```

Deve aparecer `futbotpro` com status `online`.

### 2. Ver logs em tempo real
```bash
pm2 logs futbotpro --lines 50
```

Não deve ter erros em vermelho.

### 3. Testar a API localmente na VPS
```bash
curl http://localhost:3000
```

Deve retornar HTML.

### 4. Acessar no navegador
- **Homepage**: `http://seu-dominio.com`
- **Verificar ENV**: `http://seu-dominio.com/env-check`
- **Login**: `http://seu-dominio.com/login`

### 5. Testar login
- Email: `teste@sportbot.com`
- Senha: `Teste@123`

Deve redirecionar para o dashboard com estatísticas.

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
# Verificar DATABASE_URL
cat .env | grep DATABASE_URL

# Testar conexão
bunx prisma db push
```

### Erro: "Port 3000 already in use"
```bash
# Ver o que está usando a porta
sudo lsof -i :3000

# Matar processo antigo
pm2 delete futbotpro
pm2 start bun --name futbotpro -- run start
```

### Erro: "JWT_SECRET is not defined"
```bash
# Gerar novo secret
openssl rand -base64 32

# Adicionar no .env
nano .env
# Adicionar: JWT_SECRET="cole-aqui-o-secret-gerado"
```

### Build muito lento ou trava
```bash
# Limpar cache
rm -rf .next node_modules
bun install
bun run build
```

### Ver logs de erro
```bash
# Logs em tempo real
pm2 logs futbotpro --lines 100 -f

# Ver apenas erros
pm2 logs futbotpro --err
```

---

## 🔄 Rollback (Se algo der errado)

```bash
# Voltar para versão anterior
git log --oneline -5  # Ver commits recentes
git reset --hard COMMIT_ID  # ID do commit anterior

# Reinstalar e rebuild
bun install
bun run build
pm2 restart futbotpro
```

---

## 📊 Comandos Úteis PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs futbotpro

# Reiniciar
pm2 restart futbotpro

# Parar
pm2 stop futbotpro

# Deletar
pm2 delete futbotpro

# Monitorar recursos
pm2 monit

# Informações detalhadas
pm2 show futbotpro
```

---

## ✨ Pronto!

Seu FutProBot agora está com o **modo real** implementado! 🎉

### Recursos disponíveis:
- ✅ Landing page profissional
- ✅ Sistema de autenticação
- ✅ Dashboard com estatísticas
- ✅ Análises em tempo real via API-Football
- ✅ Painel administrativo
- ✅ Histórico de previsões

### Próximos passos sugeridos:
1. Configurar SSL/HTTPS (Certbot)
2. Configurar domínio personalizado
3. Implementar sistema de pagamento
4. Adicionar notificações por email

---

**Dúvidas? Problemas? Verificar:**
1. Logs: `pm2 logs futbotpro`
2. Status: `pm2 status`
3. ENV: `http://seu-dominio.com/env-check`
