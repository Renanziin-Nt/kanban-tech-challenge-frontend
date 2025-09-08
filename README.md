Kanban Tech Challenge - Frontend

Sistema de Quadro Kanban colaborativo desenvolvido com React, TypeScript e Vite.
🚀 Tecnologias Utilizadas
Frontend

    React 18 - Biblioteca para interfaces de usuário

    TypeScript - Linguagem de programação tipada

    Vite - Build tool rápida

    TailwindCSS - Framework CSS utilitário

    React Router - Roteamento para aplicação SPA

    React DnD - Drag and drop para Kanban

    Axios - Cliente HTTP para APIs

Autenticação & Integração

    Clerk - Autenticação e gerenciamento de usuários

    React Hook Form - Gerenciamento de formulários

    Zod - Validação de schemas TypeScript

UI & UX

    Lucide React - Ícones

    TipTap - Editor de texto rico

    React Toastify - Notificações

📋 Funcionalidades
Core Features

    ✅ Autenticação com Clerk

    ✅ Quadro Kanban com drag & drop

    ✅ Colunas editáveis e reordenáveis

    ✅ Cards com informações completas

    ✅ Sistema de prioridades (Alta, Média, Baixa)

    ✅ Atribuição de tarefas a usuários

    ✅ Editor rich text para descrições

    ✅ Upload e visualização de anexos

    ✅ Histórico de atividades

    ✅ Modal de edição de cards

Recursos Técnicos

    ✅ Interface responsiva

    ✅ Estados de loading e error handling

    ✅ Atualizações otimistas

    ✅ Hooks customizados para gestão de estado

    ✅ Integração com API RESTful

🛠️ Setup Local
Pré-requisitos

    Node.js 18+ ou 20+

    npm ou yarn

    Backend rodando (veja README do backend)

1. Clone o repositório
bash

git clone <repository-url>
cd kanban-tech-challenge-frontend

2. Configure as variáveis de ambiente
bash

cp .env.example .env

Edite o arquivo .env com suas configurações:
env

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_cmlnaHQtYW1vZWJhLTk0LmNsZXJrLmFjY291bnRzLmRldiQ

# API Configuration
VITE_API_URL=http://localhost:3001/api/v1

# Optional: Development settings
VITE_DEBUG=true

3. Instale as dependências
bash

npm install
# ou
yarn install

4. Execute a aplicação
bash

# Modo desenvolvimento
npm run dev
# ou
yarn dev

# A aplicação estará disponível em: http://localhost:3000

5. Build para produção
bash

npm run build
npm run preview

🐳 Setup com Docker
Pré-requisitos

    Docker e Docker Compose instalados

Executar com Docker
bash

# Build e execução
docker-compose up --build

# Ou para desenvolvimento com hot reload
docker-compose -f docker-compose.dev.yml up

docker-compose.yml
yaml

version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
      - VITE_API_URL=${VITE_API_URL}
    volumes:
      - ./:/app
      - /app/node_modules

📦 Scripts Disponíveis
bash

# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run serve        # Servir build de produção

# Code Quality
npm run lint         # Executar ESLint
npm run lint:fix     # Executar ESLint e corrigir problemas
npm run format       # Formatar código com Prettier

# Análise
npm run analyze      # Analisar bundle size

🎯 Estrutura do Projeto
text

src/
├── components/          # Componentes React
│   ├── auth/           # Componentes de autenticação
│   ├── kanban/         # Componentes do Kanban
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes de UI genéricos
├── hooks/              # Custom React hooks
│   ├── useApi.ts       # Hook para chamadas API
│   ├── useBoard.ts     # Hook para gestão do board
│   ├── useBoardData.ts # Hook para dados do board
│   └── useToast.ts     # Hook para notificações
├── pages/              # Páginas da aplicação
│   ├── BoardPage.tsx   # Página do quadro Kanban
│   ├── Dashboard.tsx   # Página inicial
│   ├── LandingPage.tsx # Página pública
│   └── LoginPage.tsx   # Página de login
├── services/           # Serviços externos
│   └── api.ts         # Cliente da API
├── types/              # Definições TypeScript
│   └── index.ts       # Tipos globais
└── utils/              # Utilitários

🔌 Configuração da API

A aplicação espera que o backend esteja rodando em http://localhost:3001. Para configurar uma URL diferente:
env

# Para desenvolvimento local
VITE_API_URL=http://localhost:3001/api/v1

# Para produção
VITE_API_URL=https://seu-backend.com/api/v1

🔐 Configuração do Clerk
1. Criar conta no Clerk
2. Criar uma nova aplicação
3. Configurar URLs de redirecionamento:
text

http://localhost:3000/sign-in/*
http://localhost:3000/sign-up/*
http://localhost:3000/after-sign-in
http://localhost:3000/after-sign-up

4. Copiar as chaves para o .env
🎨 Personalização
Cores e Tema

As cores podem ser personalizadas no tailwind.config.js:
js

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
        }
      }
    }
  }
}

Componentes

Os componentes principais estão em src/components/kanban/:

    Card.tsx - Componente de card arrastável

    Column.tsx - Coluna do Kanban

    CardModal.tsx - Modal de edição

    RichTextEditor.tsx - Editor de descrições

🚀 Deploy
Vercel (Recomendado)
bash

# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

Netlify
bash

# Build do projeto
npm run build

# Deploy manual via drag & drop da pasta dist/

GitHub Pages
bash

# Adicionar no package.json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}

🔧 Desenvolvimento
Adicionar nova dependência
bash

npm install <package-name>
# ou
yarn add <package-name>

Estrutura de um componente
tsx

interface ComponentProps {
  title: string;
  onUpdate: (data: any) => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onUpdate }) => {
  const { data, loading } = useCustomHook();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2>{title}</h2>
      {/* conteúdo */}
    </div>
  );
};

📊 Performance Tips
Otimizações implementadas

    ✅ Code splitting com React.lazy

    ✅ Imagens otimizadas

    ✅ Bundle analysis

    ✅ Tree shaking habilitado

Monitoramento
bash

# Analisar bundle
npm run analyze

🤝 Contribuição

    Fork o projeto

    Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

    Commit suas mudanças (git commit -m 'Add some AmazingFeature')

    Push para a branch (git push origin feature/AmazingFeature)

    Abra um Pull Request

📞 Suporte

Para dúvidas sobre o frontend:

    Documentação do React: https://react.dev

    Documentação do Vite: https://vitejs.dev

    Documentação do Clerk: https://clerk.com/docs

🐛 Troubleshooting
Erro de CORS

Certifique-se que o backend está configurado para aceitar requests do frontend:
ts

// No backend
const corsOptions = {
  origin: ['http://localhost:3000', 'https://seu-frontend.com'],
  credentials: true
}

Erro de autenticação

Verifique se as chaves do Clerk estão corretas no .env
Build falhando
bash

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install