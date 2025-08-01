# Projeto Full Stack - Backend e Frontend

https://branas.io/cursos/inteligencia-artificial-para-devs/

Este projeto consiste em uma aplicação full stack com backend em Node.js/Express e frontend em React com Vite.

## Estrutura do Projeto

```
.
├── backend/          # API REST com Express e TypeScript
├── frontend/         # Aplicação React com Vite e TypeScript
└── tasks/           # Tarefas e documentação
```

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL (para o backend)

## Instalação

### 1. Clone o repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd aula2
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

### 3. Configuração do Frontend

```bash
cd frontend
npm install
```

## Como Executar

### Backend

Para rodar o servidor backend em modo de desenvolvimento:

```bash
cd backend
npm run dev
```

O servidor iniciará na porta configurada (padrão: 3000).

#### Outros comandos do Backend:

- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa o servidor compilado
- `npm test` - Executa os testes
- `npm run test:coverage` - Executa os testes com cobertura

### Frontend

Para rodar a aplicação frontend em modo de desenvolvimento:

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

#### Outros comandos do Frontend:

- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a versão de produção
- `npm run lint` - Executa o linter
- `npm test` - Executa os testes
- `npm run test:ui` - Executa os testes com interface visual
- `npm run test:run` - Executa os testes uma única vez

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL (pg-promise)
- Jest (testes)
- Cors
- UUID

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Vitest (testes)
- React Testing Library

## Desenvolvimento

### Backend
O backend utiliza Nodemon para hot-reload durante o desenvolvimento. As alterações no código serão automaticamente recarregadas.

### Frontend
O frontend utiliza Vite HMR (Hot Module Replacement) para atualizações instantâneas durante o desenvolvimento.

## Logs

Os logs de execução são salvos em:
- `backend/backend.log`
- `frontend/frontend.log`

## Testes

Para executar todos os testes do projeto:

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Build para Produção

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

Os arquivos compilados estarão em:
- Backend: `backend/dist/`
- Frontend: `frontend/dist/`