# 🔗 URL Shortener

> **Um encurtador de URLs moderno, rápido e seguro construído com Bun, TypeScript, Elysia e PostgreSQL. Arquitetura limpa com Object Calisthenics e melhores práticas do Drizzle ORM.**

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [API Reference](#-api-reference)
- [Swagger Documentation](#-swagger-documentation)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)
- [CI/CD](#-cicd)
- [Contribuição](#-contribuição)

## 🎯 Sobre o Projeto

Este é um serviço de encurtamento de URLs que permite converter URLs longas em links curtos e fáceis de compartilhar. O projeto foi desenvolvido com foco em performance, escalabilidade, código limpo e melhores práticas de desenvolvimento, seguindo princípios de **Clean Architecture** e **Object Calisthenics**.

### ⭐ Funcionalidades

- ✅ **Encurtamento de URLs** - Transforma URLs longas em links curtos
- ✅ **ShortRef Customizado** - Permite definir códigos personalizados
- ✅ **Redirecionamento rápido** - Busca eficiente com pool de conexões
- ✅ **Validação robusta** - Camada de validação separada e especializada
- ✅ **Geração automática** - Algoritmo otimizado com timestamp + random
- ✅ **API REST documentada** - Interface com Swagger/OpenAPI
- ✅ **Métricas e Analytics** - Contagem de acessos e estatísticas
- ✅ **Pool de Conexões** - PostgreSQL otimizado para produção
- ✅ **Persistência avançada** - Schema otimizado com índices estratégicos
- ✅ **Containerização** - Deploy com Docker e graceful shutdown
- ✅ **Arquitetura Limpa** - Object Calisthenics e SOLID principles

## 🛠 Tecnologias

| Categoria           | Tecnologia                              | Versão | Descrição                                  |
| ------------------- | --------------------------------------- | ------ | ------------------------------------------ |
| **Runtime**         | [Bun](https://bun.com)                  | 1.x    | Runtime JavaScript/TypeScript ultra-rápido |
| **Framework**       | [Elysia](https://elysiajs.com)          | 1.4.5  | Framework web moderno para Bun             |
| **Linguagem**       | TypeScript                              | 5.x    | Superset tipado do JavaScript              |
| **Banco de Dados**  | PostgreSQL                              | 17     | Banco relacional com Pool de conexões      |
| **ORM**             | [Drizzle ORM](https://orm.drizzle.team) | 0.44.5 | ORM TypeScript-first com melhores práticas |
| **Documentação**    | Swagger/OpenAPI                         | 3.0    | Documentação interativa da API             |
| **Containerização** | Docker                                  | -      | Containerização da aplicação               |
| **Linter**          | ESLint                                  | 9.x    | Análise estática de código                 |
| **Formatter**       | Prettier                                | 3.6.2  | Formatação de código                       |

## 🏗 Arquitetura

O projeto segue os princípios de **Clean Architecture**, **SOLID** e **Object Calisthenics**, organizando o código em camadas bem definidas com separação clara de responsabilidades:

```
src/
├── controller/                    # Camada de Controle (HTTP)
│   ├── insert-controller.ts      # Controller para criação de URLs curtas
│   └── search-controller.ts      # Controller para busca de URLs
├── services/                     # Camada de Serviços (Business Logic)
│   └── url-service.ts            # Lógica de negócio unificada
├── validators/                   # Validação de Dados (Object Calisthenics)
│   ├── request-validator.ts      # Validação de requests HTTP
│   └── url-validator.ts          # Validação específica de URLs
├── db/                          # Camada de Dados
│   ├── client.ts                # Pool de conexões PostgreSQL
│   ├── repository/              # Repositórios de dados
│   │   └── url-repository.ts    # Operações CRUD + analytics
│   ├── schema.ts                # Schemas do banco unificados
│   └── schemas/                 # Definições específicas
│       └── url_reference.ts     # Schema da tabela principal
├── generators/                  # Utilitários de Geração
│   └── short-ref-generator.ts   # Geração otimizada de códigos curtos
├── helpers/                     # Utilitários
│   ├── http-helpers.ts          # Helpers para HTTP
│   └── url-helpers.ts           # Validação e geração de URLs
└── errors/                      # Tratamento de Erros
    ├── index.ts
    ├── missing-param-error.ts
    └── server-error.ts
```

### 🔧 Padrões Arquiteturais

- **Clean Architecture** - Separação rigorosa em camadas com inversão de dependência
- **Object Calisthenics** - Separação de validações da lógica de negócio
- **Repository Pattern** - Abstração completa da camada de dados
- **Service Layer** - Centralização da lógica de negócio
- **Pool Connections** - Otimização de conexões com PostgreSQL
- **Validator Classes** - Validações especializadas e reutilizáveis
- **Error Handling** - Tratamento centralizado e tipado de erros
- **Graceful Shutdown** - Fechamento elegante de conexões

## 🚀 Instalação

### Pré-requisitos

- [Bun](https://bun.com) v1.2.22+
- [Docker](https://docker.com) (opcional)
- [PostgreSQL](https://postgresql.org) 17+ (se não usar Docker)

### Instalação Local

1. **Clone o repositório**

```bash
git clone https://github.com/andreyhitoshi1997/url_shortener.git
cd url_shortener
```

2. **Instale as dependências**

```bash
bun install
```

3. **Configure o ambiente**

```bash
# Crie o arquivo .env
cp .env.example .env

# Configure as variáveis (exemplo)
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/url_shortener_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=url_shortener_dev
POSTGRES_PORT=5432
```

4. **Execute as migrações**

```bash
bun run drizzle-kit migrate
```

5. **Inicie a aplicação**

```bash
bun run start
```

### Instalação com Docker

1. **Clone o repositório**

```bash
git clone https://github.com/andreyhitoshi1997/url_shortener.git
cd url_shortener
```

2. **Configure o .env** (mesmo arquivo da instalação local)

3. **Execute com Docker Compose**

```bash
# Sobe todos os serviços
bun run docker:up

# Para parar os serviços
bun run docker:down
```

## 💻 Uso

### Exemplo Básico

```bash
# 1. Encurtar uma URL com código automático
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"targetRef": "https://www.google.com"}'

# Resposta:
# {"id": "uuid", "shortRef": "2024abc", "targetRef": "https://www.google.com"}

# 2. Encurtar uma URL com código personalizado
curl -X POST "http://localhost:3000/api/shorten?shortRef=google" \
  -H "Content-Type: application/json" \
  -d '{"targetRef": "https://www.google.com"}'

# Resposta:
# {"id": "uuid", "shortRef": "google", "targetRef": "https://www.google.com"}

# 3. Buscar URL original
curl "http://localhost:3000/api/search?shortRef=google"

# Resposta:
# {"targetRef": "https://www.google.com"}

# 4. Acessar documentação Swagger
curl "http://localhost:3000/swagger"
```

### Scripts Disponíveis

```bash
# Desenvolvimento
bun run start              # Inicia a aplicação
bun run docker:up         # Sobe ambiente completo
bun run docker:down       # Para ambiente Docker

# Banco de dados (Drizzle ORM)
bunx drizzle-kit generate  # Gera migrações
bunx drizzle-kit migrate   # Executa migrações
bunx drizzle-kit studio    # Interface visual do banco (Drizzle Studio)
bunx drizzle-kit check     # Verifica consistência das migrações

# Qualidade de código
bunx eslint src/           # Análise estática
bunx prettier --write .    # Formatação automática

# Testes e validação
curl "http://localhost:3000/"              # Health check
curl "http://localhost:3000/swagger"       # Swagger documentation
```

## 📡 API Reference

### Health Check

#### GET `/`

Verifica se a aplicação está funcionando.

**Response (200):**

```json
{
  "message": "URL Shortener API is running"
}
```

### POST `/api/shorten`

Cria uma URL encurtada com código automático ou personalizado.

**Query Parameters (Opcional):**

- `shortRef` (string) - Código personalizado para a URL (deve ser único)

**Request Body:**

```json
{
  "targetRef": "https://exemplo.com/url-muito-longa"
}
```

**Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "shortRef": "2024abc", // ou código personalizado se fornecido
  "targetRef": "https://exemplo.com/url-muito-longa"
}
```

**Códigos de Status:**

- `201` - URL criada com sucesso
- `400` - Parâmetros inválidos, URL malformada ou shortRef já existe

### GET `/api/search`

Busca a URL original através da referência curta e incrementa contador de acesso.

**Query Parameters:**

- `shortRef` (string, obrigatório) - Código da URL encurtada

**Response (200):**

```json
{
  "targetRef": "https://exemplo.com/url-muito-longa"
}
```

**Códigos de Status:**

- `200` - URL encontrada
- `400` - Parâmetro shortRef obrigatório
- `404` - URL não encontrada

## 📚 Swagger Documentation

A aplicação inclui documentação interativa com Swagger/OpenAPI acessível em:

- **Local**: http://localhost:3000/swagger
- **Produção**: https://seu-dominio.com/swagger

### Recursos do Swagger

- ✅ **Interface interativa** - Teste endpoints diretamente no navegador
- ✅ **Documentação completa** - Esquemas de request/response detalhados
- ✅ **Validação em tempo real** - Feedback imediato sobre parâmetros
- ✅ **Exemplos práticos** - Casos de uso para cada endpoint

### Exemplos de Uso

```javascript
// Encurtar URL com código automático
const response = await fetch("http://localhost:3000/api/shorten", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ targetRef: "https://github.com" }),
});
const { shortRef } = await response.json();

// Encurtar URL com código personalizado
const customResponse = await fetch(
  "http://localhost:3000/api/shorten?shortRef=github",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetRef: "https://github.com" }),
  }
);
const { shortRef: customRef } = await customResponse.json();

// Buscar URL original
const searchResponse = await fetch(
  `http://localhost:3000/api/search?shortRef=${shortRef}`
);
const { targetRef } = await searchResponse.json();
```

## 🔧 Desenvolvimento

### Estrutura do Banco de Dados

```sql
-- Tabela principal com campos otimizados
CREATE TABLE url_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_ref TEXT NOT NULL UNIQUE,           -- Índice único para performance
  target_ref TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  access_count INTEGER DEFAULT 0           -- Contador de acessos
);

-- Índices estratégicos para performance
CREATE UNIQUE INDEX idx_short_ref ON url_reference(short_ref);
CREATE INDEX idx_created_at ON url_reference(created_at);
```

### Pool de Conexões PostgreSQL

O projeto utiliza **Pool de Conexões** para otimização de performance:

```typescript
// Configuração do Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Máximo 20 conexões simultâneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
```

### Comandos Úteis

```bash
# Linting e formatação
bunx eslint src/          # Executar linter
bunx prettier --write .   # Formatar código

# Banco de dados
bunx drizzle-kit studio   # Interface visual Drizzle Studio
bunx drizzle-kit check    # Verificar migrações
bunx drizzle-kit generate # Gerar novas migrações
bunx drizzle-kit migrate  # Aplicar migrações

# Docker
docker logs url_shortener_app                    # Logs da aplicação
docker exec -it postgres_dev psql -U postgres -d url_shortener_dev
docker-compose up --build -d                     # Rebuild completo

# Testes de carga e validação
curl "http://localhost:3000/"                    # Health check
curl "http://localhost:3000/swagger"             # Swagger UI
```

### Object Calisthenics - Validações

O projeto implementa **Object Calisthenics** para separar validações da lógica de negócio:

```typescript
// src/validators/request-validator.ts
export class RequestValidator {
  static validateInsertRequest(data: any): string {
    if (!data?.targetRef) {
      return "Missing required parameter: targetRef";
    }
    return "";
  }
}

// src/validators/url-validator.ts
export class UrlValidator {
  static validateUrl(url: string): string {
    try {
      new URL(url);
      return "";
    } catch {
      return "Invalid URL format";
    }
  }
}
```

### Service Layer - Business Logic

Lógica de negócio centralizada e limpa:

```typescript
// src/services/url-service.ts
export async function insertUrlService(
  targetRef: string,
  customShortRef?: string
) {
  // Validações usando Object Calisthenics
  const requestError = RequestValidator.validateInsertRequest({ targetRef });
  if (requestError) throw new MissingParamError(requestError);

  const urlError = UrlValidator.validateUrl(targetRef);
  if (urlError) throw new MissingParamError(urlError);

  // Lógica de negócio
  const shortRef = customShortRef || generateShortRef();
  return await urlRepository.create({ shortRef, targetRef });
}
```

### Variáveis de Ambiente

| Variável            | Obrigatória | Padrão | Descrição                             |
| ------------------- | ----------- | ------ | ------------------------------------- |
| `PORT`              | Não         | `3000` | Porta da aplicação                    |
| `DATABASE_URL`      | Sim         | -      | String de conexão PostgreSQL com Pool |
| `POSTGRES_USER`     | Sim         | -      | Usuário do PostgreSQL                 |
| `POSTGRES_PASSWORD` | Sim         | -      | Senha do PostgreSQL                   |
| `POSTGRES_DB`       | Sim         | -      | Nome do banco de dados                |
| `POSTGRES_PORT`     | Não         | `5432` | Porta do PostgreSQL                   |

### Algoritmo de Geração de ShortRef

O projeto usa um algoritmo otimizado que combina timestamp com aleatoriedade:

```typescript
export function generateShortRef(): string {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const random = Math.random().toString(36); // Random string
  return (timestamp + random).substring(0, 7); // 7 caracteres únicos
}
```

**Vantagens:**

- ✅ **Unicidade temporal** - Timestamp garante ordem cronológica
- ✅ **Collision-resistant** - Aleatoriedade reduz colisões
- ✅ **Performance** - Geração rápida sem consultas ao banco
- ✅ **Legível** - Formato Base36 (0-9, a-z)

## 🚢 Deploy

### Deploy Manual

```bash
# 1. Build da imagem
docker build -t url-shortener .

# 2. Execute o container com Pool de conexões
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db?max=20" \
  url-shortener
```

### Deploy na Produção

O projeto está configurado para deploy automático via GitHub Actions. A imagem é publicada na conta oficial do Docker Hub e pode ser usada em qualquer ambiente:

```bash
# Pull da imagem oficial
docker pull andreyhitoshi1997/url-shortener:latest

# Executar em produção
docker run -d -p 3000:3000 \
  -e DATABASE_URL="sua_connection_string_com_pool" \
  --name url-shortener-prod \
  andreyhitoshi1997/url-shortener:latest
```

### Deploy com Docker Compose

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  app:
    image: andreyhitoshi1997/url-shortener:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/url_shortener?max=20
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:17
    environment:
      POSTGRES_DB: url_shortener
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

## 🔄 CI/CD

### GitHub Actions

O projeto inclui um workflow completo de CI/CD que:

#### 1. **Testing Pipeline**

- ✅ Checkout do código
- ✅ Setup do ambiente Bun
- ✅ Instalação de dependências
- ✅ Configuração do PostgreSQL
- ✅ Execução de migrações
- ✅ Testes da aplicação

#### 2. **Build & Deploy Pipeline**

- ✅ Build da imagem Docker
- ✅ Push para Docker Hub
- ✅ Suporte multi-arquitetura (AMD64/ARM64)
- ✅ Versionamento automático

### Configuração de Secrets

Para configurar o CI/CD, adicione estas variáveis no GitHub:

**Secrets:**
| Nome | Valor | Descrição |
|------|-------|-----------|
| `POSTGRES_USER` | `postgres` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | Senha do PostgreSQL |
| `DOCKER_USERNAME` | `seu_usuario` | Usuário do Docker Hub |
| `DOCKER_PASSWORD` | `seu_token` | Token do Docker Hub |

**Variables:**
| Nome | Valor | Descrição |
|------|-------|-----------|
| `PORT` | `3000` | Porta da aplicação |
| `POSTGRES_DB` | `url_shortener_dev` | Nome do banco |
| `POSTGRES_PORT` | `5432` | Porta do PostgreSQL |

### Fluxo de Deploy

1. **Push/PR para `main` ou `rest`** → Executa testes
2. **Testes aprovados** → Build e push da imagem Docker
3. **Deploy automático** → Imagem disponível no Docker Hub

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: amazing feature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Commit

Usamos [Conventional Commits](https://conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: mudanças em ferramentas/configuração
```

`
