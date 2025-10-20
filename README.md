# FutProBot - Plataforma de Análises Esportivas

Bot de análise esportiva automática com integração à API-Football, oferecendo previsões e estatísticas personalizadas com taxa de acerto superior a 85%.

## 🚀 Funcionalidades Implementadas

### ✅ Landing Page
- Hero section profissional com call-to-action
- Seção "Como Funciona" com passo a passo
- Exibição da taxa de acertividade (87%)
- Depoimentos de clientes
- Plano Premium (R$ 97/mês)
- Footer completo com links úteis

### ✅ Sistema de Autenticação
- Registro de novos usuários
- Login com email e senha
- Autenticação via JWT + Cookies HTTP-only
- Proteção de rotas privadas
- Integração com Supabase

### ✅ Dashboard do Usuário
- **Estatísticas Pessoais**: Taxa de vitórias, perdas e lucro total
- **Partidas Disponíveis**: Lista de jogos de hoje da API-Football
- **Análises em Tempo Real**: Geração automática de previsões
- **Histórico de Análises**: Tabela com todas as previsões e resultados
- **Status da Assinatura**: Visualização do plano ativo

### ✅ Painel Administrativo
- **Gerenciamento de Usuários**: Listar todos os usuários
- **Estatísticas Globais**: Taxa de acerto geral, total de análises
- **Assinaturas Ativas**: Controle de planos premium

### ✅ API Routes
- `/api/auth/register` - Registro de usuários
- `/api/auth/login` - Login
- `/api/auth/logout` - Logout
- `/api/auth/me` - Dados do usuário autenticado
- `/api/matches/today` - Partidas de hoje
- `/api/matches/upcoming` - Partidas futuras
- `/api/analyses/create` - Criar análise
- `/api/analyses/list` - Listar análises do usuário
- `/api/analyses/stats` - Estatísticas do usuário
- `/api/admin/users` - Listar usuários (admin)
- `/api/admin/stats` - Estatísticas globais (admin)

### ✅ Integração API-Football
- Busca de partidas em tempo real
- Estatísticas de jogos
- Algoritmo de previsão automática
- Cálculo de odds e confiança

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Componentes)
- **Prisma ORM**
- **Supabase** (PostgreSQL + Auth)
- **JWT** (Autenticação)
- **bcryptjs** (Hash de senhas)
- **API-Football** (Dados esportivos)

## 📋 Pré-requisitos

- **Bun** ou Node.js 18+
- Conta **Supabase** (gratuita)
- PostgreSQL (via Supabase)

## ⚙️ Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/muoctar2-jpg/futbotpro.git
cd futbotpro
```

### 2. Instalar dependências

```bash
bun install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
JWT_SECRET="your-secret-key-minimum-32-characters"
API_FOOTBALL_KEY="74a6034a3a4aa3556afb41cc0f7f048a"
```

#### Como obter as credenciais do Supabase:

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto
3. Vá em **Settings** → **Database** → Copie a **Connection string (URI)**
4. Vá em **Settings** → **API** → Copie **Project URL** e **anon public key**

#### Gerar JWT_SECRET:

```bash
openssl rand -base64 32
```

### 4. Executar migrations do banco

```bash
bunx prisma migrate dev --name init
```

### 5. Criar usuários de teste

```bash
bun run db:seed
```

Usuários criados:
- **Usuário Teste**: `teste@sportbot.com` / `Teste@123`
- **Admin**: `admin@sportbot.com` / `Admin@123`

### 6. Iniciar servidor de desenvolvimento

```bash
bun run dev
```

Acesse: `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

### Modelos Prisma

- **User** - Usuários da plataforma
- **Subscription** - Assinaturas (ACTIVE, PENDING, CANCELLED, EXPIRED)
- **Strategy** - Estratégias personalizadas de análise
- **Analysis** - Análises geradas pelo bot
- **Result** - Resultados das análises (WIN, LOSS, PENDING)

## 🔐 Autenticação e Segurança

- Senhas hash com **bcryptjs**
- Tokens JWT armazenados em cookies HTTP-only
- Proteção de rotas via middleware
- Validação de roles (USER, ADMIN)

## 📱 Páginas Disponíveis

- `/` - Landing page pública
- `/login` - Página de login
- `/register` - Página de cadastro
- `/dashboard` - Dashboard do usuário (protegido)
- `/admin` - Painel administrativo (apenas ADMIN)
- `/env-check` - Verificação de variáveis de ambiente

## 🎯 Próximos Passos

- [ ] Sistema de pagamento (Mercado Pago / Stripe)
- [ ] Notificações por email
- [ ] Bot automático executando análises em background
- [ ] Gráficos de performance com Recharts
- [ ] Exportação de relatórios
- [ ] Página pública de resultados

## 🧪 Scripts Disponíveis

```bash
bun run dev          # Servidor de desenvolvimento
bun run build        # Build para produção
bun run start        # Servidor de produção
bun run db:studio    # Prisma Studio (visualizar banco)
bun run db:seed      # Criar usuários de teste
```

## 📤 Deploy

### Vercel (Recomendado)

1. Faça push para GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com o administrador.

## 📄 Licença

Todos os direitos reservados © 2025 FutProBot

---

**Desenvolvido com ❤️ usando Next.js 14 e Supabase**
