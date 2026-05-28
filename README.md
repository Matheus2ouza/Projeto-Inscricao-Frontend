## Organização do Projeto (Feature-Sliced + Clean Architecture)

Esta estrutura organiza o código por features e separa utilitários compartilhados, visando alta coesão e baixo acoplamento.

### App (src/app)

- Apenas rotas e páginas. Não contém lógica de negócio.
- Subpastas `(public)` e `(private)` organizam seções públicas e autenticadas.
- `api/` contém rotas da App Router (server actions/endpoints internos).

### Features (src/features)

Cada feature possui seu próprio boundary:

- `components/`: componentes específicos da feature
- `hooks/`: hooks específicos da feature
- `api/`: chamadas HTTP/clients específicos da feature
- `types/`: tipos/interfaces da feature

Exemplos atuais:

- `features/accounts`: componentes e hooks de contas
- `features/regions`: componentes de seleção de regiões
- `features/auth/api`: `login.ts`, `register.ts`, `refreshToken.ts`

### Shared (src/shared)

Repositório de building blocks reutilizáveis:

- `components/ui/`: UI genérica (botões, inputs, dialog, popover, etc.)
- `components/layout/`: layout global (sidebars, navbars, headers, footers)
- `hooks/`: hooks reutilizáveis sem dependência de feature
- `lib/`: utilitários e bibliotecas genéricas compartilhadas
  - `apiClient.ts`: axios configurado com interceptors de token e refresh
  - `dal.ts`: acesso a cookies/sessão no servidor
  - `utils.ts`: utilidades como `cn`, flags de ambiente
  - `getRefreshToken.ts`: utilitário para refresh token

### Providers (src/providers)

- `theme-provider.tsx`, `heroui-provider.tsx` e demais provedores de contexto.

### Middleware (src/middleware.ts)

- Middlewares globais para autenticação/roteamento.

## Regras seguidas

- UI genérica em `src/shared/components/ui`
- Layout global em `src/shared/components/layout`
- Hooks reutilizáveis em `src/shared/hooks`
- Utilitários/libs genéricas em `src/shared/lib`
- Services da feature `auth` movidos para `src/features/auth/api`
- Comboboxes distribuídos para as features correspondentes (`accounts`, `regions`)
- `apiClient.ts` centraliza axios e substitui o antigo `src/lib/api.ts`
- `src/app` permanece apenas com rotas/páginas

## Caminhos de import

- `@/shared/*` para recursos compartilhados
- `@/features/*` para recursos de features
- `@/providers/*` para provedores
- `@/app/*` apenas para rotas/páginas

## Como contribuir

- Ao criar nova feature, use `src/features/<feature>/{components,hooks,api,types}`
- Se algo for genérico, promova para `src/shared`
- Evite colocar lógica de negócio dentro de `src/app`

# Sistema de Inscrições - R2

Uma plataforma completa para gerenciamento de eventos e inscrições, desenvolvida com Next.js 13+ e App Router.

## 🚀 Tecnologias

- **Next.js 13+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **HeroUI** - Componentes de UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📁 Estrutura do Projeto

```
src/
├── app/                          # App Router (Next.js 13+)
│   ├── (public)/                # Rotas públicas
│   │   ├── home/               # Página inicial
│   │   │   ├── home.tsx        # Componente da página home
│   │   │   ├── page.tsx        # Rota /home
│   │   │   └── hooks/          # Hooks específicos da home
│   │   └── login/              # Página de login
│   │       ├── login.tsx       # Componente da página login
│   │       ├── page.tsx        # Rota /login
│   │       └── hooks/          # Hooks específicos do login
│   │           └── useFormLogin.tsx
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Rota raiz (redireciona para /home)
│   └── globals.css             # Estilos globais
├── shared/                      # Componentes e utilitários compartilhados
│   ├── components/
│   │   └── ui/                 # Componentes de UI reutilizáveis
│   │       ├── home-navbar.tsx # Navbar da home
│   │       ├── logo.tsx        # Componente de logo
│   │       ├── button.tsx      # Botão customizado
│   │       ├── input.tsx       # Input customizado
│   │       ├── alert.tsx       # Componente de alerta
│   │       └── background.tsx  # Background animado
│   └── hooks/                  # Hooks compartilhados
├── components/                  # Componentes específicos
│   └── theme/
│       └── mode-toggle.tsx     # Toggle de tema escuro/claro
├── providers/                   # Providers do React
│   ├── theme-provider.tsx      # Provider de tema
│   └── heroui-provider.tsx     # Provider do HeroUI
├── services/                    # Serviços de API
│   ├── login/
│   │   └── login.service.ts    # Serviço de login
│   └── register/
│       └── register.service.ts # Serviço de registro
└── lib/
    └── utils.ts                # Utilitários gerais
```

## 🔐 Papéis (roles) e rotas protegidas

O sistema suporta quatro roles:

- USER
- MANAGER
- ADMIN
- SUPER

### Telas disponíveis

- USER: `/(private)/dashboard/page.tsx` acessível em `/dashboard`
- ADMIN: `/(private)/admin/page.tsx` acessível em `/admin`
- MANAGER: `/(private)/manager/page.tsx` acessível em `/manager` (reutiliza a tela de admin)
- SUPER: `/(private)/super/page.tsx` acessível em `/super`

### Como o role é definido

Durante o login (`src/services/auth/login/login.service.ts`), após validar credenciais, o backend retorna `authToken`, `refreshToken` e `role`.

No serviço de login criamos o cookie `session` com o seguinte formato:

```json
{
  "user": {
    "expires": "2025-01-31T12:00:00.000Z",
    "role": "ADMIN"
  }
}
```

Também persistimos `authToken` e `refreshToken` por compatibilidade.

### Validação no middleware

O arquivo `src/middleware.ts` intercepta requisições e:

- Permite livre acesso a rotas públicas (ex.: `/`, `/login`, documentação) e a assets (`/_next/*`, `/images/*`, etc.).
- Bloqueia acesso a rotas privadas quando não há `authToken` (redireciona para `/login`).
- Quando autenticado, valida se a URL acessada é compatível com o `role` do usuário presente em `session`:
  - SUPER → `/super`
  - ADMIN → `/admin`
  - MANAGER → `/manager`
  - USER → `/dashboard`

Se a URL não começar com o prefixo esperado, o middleware redireciona para a home daquela role.

### Onde fica a verificação de sessão

Em `src/lib/dal.ts` temos:

- `verifySession()`: lê o cookie `session`, valida expiração e retorna `{ user, expires }`.
- Helpers `isSuper`, `isAdmin`, `isManager`, `isUser` e `hasRole`.

### Logout

O logout é feito via `POST /api/logout` (arquivo `src/app/api/logout/route.ts`), que remove os cookies de sessão. No cliente, o hook `useLogout` (`src/shared/hooks/logout/logout.ts`) dispara essa rota e redireciona para `/login`.

### Obtendo a role no cliente

- Rota: `GET /api/session` (arquivo `src/app/api/session/route.ts`) retorna `{ role }` com base no cookie `session`.
- Hook: `useUserRole` (`src/shared/hooks/useUserRole.ts`) faz fetch com `cache: 'no-store'` e revalida em foco/visibilidade.
- Assim, após logout o hook voltará a `role = null` e não persistirá a role anterior.

Exemplo de uso em páginas `"use client"`:

```tsx
import { useUserRole } from '@/shared/hooks/useUserRole';

export default function AdminSharedPage() {
  const { role, loading } = useUserRole();

  if (loading) return null;

  return (
    <div>
      {/* Botão visível apenas para ADMIN (não para MANAGER) */}
      {role === 'ADMIN' && (
        <button className="btn">Ação exclusiva do Admin</button>
      )}
    </div>
  );
}
```

## 🧪 Como testar

1. Faça login e certifique-se de que o backend retorna um `role` válido.
2. Após login, você será redirecionado automaticamente para a rota correspondente ao seu role por ação do middleware.
3. Tente acessar manualmente outra rota privada (ex.: um USER indo para `/admin`) → o middleware deve redirecionar para a rota correta.
4. Clique em sair em qualquer página privada → deve limpar cookies e voltar para `/login`.

## 🖼️ Assets estáticos

- Assets são servidos a partir de `public/`. Use caminhos absolutos como `/images/logo.png` no front.
- O middleware ignora `/images/*` no `matcher` para não bloquear imagens.

## 🎯 Padrão de Organização

### Estrutura de Rotas

Cada rota segue o padrão:

```
app/(public)/[rota]/
├── [rota].tsx      # Componente principal da página
├── page.tsx        # Arquivo de rota do Next.js
└── hooks/          # Hooks específicos da rota
    └── use[Funcionalidade].tsx
```

### Exemplo: Rota Login

```
app/(public)/login/
├── login.tsx           # Componente Login
├── page.tsx           # Exporta o componente Login
└── hooks/
    └── useFormLogin.tsx # Hook para formulário de login
```

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Gera build de produção
npm run start        # Executa build de produção
npm run lint         # Executa linter
```

## 🎨 Funcionalidades

### Página Home (`/home`)

- **Hero Section** - Apresentação do sistema
- **Sobre** - Informações sobre funcionalidades
- **Eventos** - Lista de eventos disponíveis
- **Footer** - Informações de contato

### Página Login (`/login`)

- **Formulário de Login** - Campos de usuário e senha
- **Validação** - Validação com React Hook Form + Zod
- **Tema** - Suporte a tema escuro/claro
- **Responsivo** - Design adaptável

### Componentes Compartilhados

- **HomeNavbar** - Navegação principal
- **Logo** - Logo dinâmico (claro/escuro)
- **Button** - Botão customizado
- **Input** - Input com validação
- **Alert** - Componente de alerta

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Adicione suas variáveis de ambiente aqui
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Tema

O sistema suporta tema claro e escuro automaticamente baseado nas preferências do sistema.

## 📱 Responsividade

- **Mobile First** - Design otimizado para mobile
- **Breakpoints** - sm, md, lg, xl
- **Menu Mobile** - Menu hambúrguer responsivo

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:

- Netlify
- AWS Amplify
- Railway
- Heroku

## 📝 Convenções

### Nomenclatura

- **Componentes**: PascalCase (`HomeNavbar`)
- **Arquivos**: kebab-case (`home-navbar.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useFormLogin`)
- **Rotas**: kebab-case (`/home`, `/login`)

### Estrutura de Arquivos

- Cada rota tem sua própria pasta
- Hooks específicos ficam dentro da pasta da rota
- Componentes compartilhados ficam em `shared/components/ui/`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Email**: contato@sistemainscricao.com
- **Telefone**: (91) 99258-7483
- **Localização**: Belém, PA - Brasil

---

**Sistema de Inscrições - R2** © 2025
