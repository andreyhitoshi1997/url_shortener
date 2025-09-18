# GitHub Actions Configuration

Este projeto usa GitHub Actions para CI/CD com deploy automático para Docker Hub. Para configurar corretamente, você precisa definir as seguintes variáveis no seu repositório GitHub.

## 🔐 Secrets (Dados sensíveis)

Vá em: **Settings → Secrets and variables → Actions → Secrets**

Adicione os seguintes secrets:

| Nome                | Valor         | Descrição                     |
| ------------------- | ------------- | ----------------------------- |
| `POSTGRES_USER`     | `postgres`    | Usuário do PostgreSQL         |
| `POSTGRES_PASSWORD` | `postgres`    | Senha do PostgreSQL           |
| `DOCKER_USERNAME`   | `seu_usuario` | Seu usuário do Docker Hub     |
| `DOCKER_PASSWORD`   | `sua_senha`   | Sua senha/token do Docker Hub |

## 📝 Variables (Dados não sensíveis)

Vá em: **Settings → Secrets and variables → Actions → Variables**

Adicione as seguintes variáveis:

| Nome            | Valor               | Descrição              |
| --------------- | ------------------- | ---------------------- |
| `PORT`          | `3000`              | Porta da aplicação     |
| `POSTGRES_DB`   | `url_shortener_dev` | Nome do banco de dados |
| `POSTGRES_PORT` | `5432`              | Porta do PostgreSQL    |

## 🐳 Docker Hub Setup

1. **Crie uma conta no Docker Hub**: https://hub.docker.com/
2. **Crie um repositório** chamado `url-shortener`
3. **Gere um Access Token**:
   - Settings → Security → New Access Token
   - Use este token como `DOCKER_PASSWORD`

## 🚀 Como o Workflow Funciona

### 1. **Test Job**

- ✅ Faz checkout do código
- ✅ Configura Bun runtime
- ✅ Instala dependências
- ✅ Configura banco PostgreSQL como serviço
- ✅ Cria arquivo `.env` com as variáveis do GitHub
- ✅ Executa migrações do banco
- ✅ Inicia a aplicação
- ✅ Testa endpoints da API

### 2. **Docker Build & Push Job**

- ✅ Faz login no Docker Hub
- ✅ Constrói imagem Docker para múltiplas arquiteturas
- ✅ Faz push para Docker Hub com tags:
  - `latest` (branch main)
  - `branch-sha` (para tracking)
- ✅ Só executa se os testes passaram

### 3. **Deploy Job**

- ✅ Só executa na branch `main`
- ✅ Só executa se build e testes passaram
- ✅ Mostra informações sobre o deploy

## 🔧 Triggers

O workflow executa em:

- Push para branches `main` ou `rest`
- Pull requests para `main` ou `rest`

## 📦 Imagem Docker Deployada

Após o deploy, sua imagem estará disponível em:

```bash
docker pull seu_usuario/url-shortener:latest
```

## 🏃‍♂️ Como usar a imagem deployada

### Opção 1: Docker Run

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  seu_usuario/url-shortener:latest
```

### Opção 2: Atualizar docker-compose.yml

```yaml
services:
  app:
    image: seu_usuario/url-shortener:latest # ← Em vez de build: .
    # ... resto da configuração
```

## 📋 Estrutura do .env no Actions

O workflow automaticamente cria um arquivo `.env` com:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:senha@localhost:5432/url_shortener_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha
POSTGRES_DB=url_shortener_dev
POSTGRES_PORT=5432
```

## � Fluxo de Deploy

1. **Push para `main`** → Executa testes
2. **Testes passam** → Build & Push para Docker Hub
3. **Deploy bem-sucedido** → Imagem disponível publicamente

Seu encurtador de URL agora tem CI/CD completo! 🎉
