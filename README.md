# OS Fácil 🏎️

Aplicativo mobile para **gestão de oficinas automotivas**, desenvolvido com **React Native** e **Expo**. 

O **OS Fácil** permite organizar e controlar ordens de serviço, clientes e veículos de forma simples, rápida e eficiente. Com uma interface intuitiva, o app facilita o cadastro, busca e acompanhamento dos serviços realizados, tornando o dia a dia da oficina mais produtivo e profissional.

## 🔧 Requisitos

- **Node.js** v16+ e **npm** v8+
- **Expo CLI** (instalado globalmente)
- **Android Studio** ou **Xcode** (para emulador)
- **Expo Go** (app móvel, para teste rápido)

---

## 📦 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/FIAP-MOBILE-2025-Agosto/2tdspa-challenge-sprint-fabioeduu.git
cd 2tdspa-challenge-sprint-fabioeduu
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Verifique a instalação:**

```bash
npm start --version
expo --version
```

---

## 🚀 Execução

### Modo Desenvolvimento (Expo Go)

```bash
npm start
```

Escaneie o **QR code** com o app **Expo Go** (Android) ou câmera do iPhone (iOS).

### Simulador Android

```bash
npm run android
```

### Simulador iOS

```bash
npm run ios
```

### Web (Navegador)

```bash
npm run web
```

> **Nota:** A aplicação roda por padrão na porta **8082** (se 8081 estiver em uso).

---

## 📁 Estrutura do Projeto

```
2tdspa-challenge-sprint-fabioeduu/
├── assets/                          # Imagens, ícones e splash
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
│
├── src/
│   ├── types.ts                     # Tipos e interfaces globais
│   │
│   ├── api/                         # Camada de API
│   │   ├── api.ts                   # Config Axios (baseURL, timeout)
│   │   ├── auth.ts                  # Endpoints de login/register
│   │   ├── cliente.ts               # CRUD de clientes
│   │   ├── veiculo.ts               # CRUD de veículos
│   │   └── ordemServico.ts          # CRUD de ordens de serviço
│   │
│   ├── app/                         # Estrutura de rotas (Expo Router)
│   │   ├── _layout.tsx              # Layout raiz
│   │   ├── login.tsx                # Tela de login
│   │   ├── register.tsx             # Tela de registro
│   │   │
│   │   └── (tabs)/                  # Grupo de abas
│   │       ├── _layout.tsx          # Layout com navegação inferior
│   │       ├── index.tsx            # Redirecionamento padrão
│   │       ├── home.tsx             # Página inicial
│   │       ├── clientes.tsx         # Listagem de clientes
│   │       ├── busca.tsx            # Busca de clientes
│   │       ├── veiculos.tsx         # Listagem de veículos
│   │       ├── ordem.tsx            # Listagem de ordens
│   │       └── perfil.tsx           # Perfil do usuário + logout
│   │
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── Header.tsx               # Cabeçalho
│   │   ├── Footer.tsx               # Navegação inferior
│   │   ├── Container.tsx            # Wrapper de contêiner
│   │   ├── Cliente.tsx              # Card de cliente
│   │   ├── Veiculo.tsx              # Card de veículo
│   │   ├── Ordem.tsx                # Card de ordem de serviço
│   │   └── Home.tsx                 # Conteúdo home
│   │
│   └── hooks/                       # hooks
│       ├── index.ts                 # Exports
│       ├── useAuth.ts               # autenticação
│       ├── useClientes.ts           # Fetch e estado de clientes
│       ├── useVeiculos.ts           # Fetch e estado de veículos
│       └── useOrdens.ts             # Fetch e estado de ordens
│
├── App.tsx                          # Componente raiz
├── app.json                         # Config Expo
├── package.json                     # Dependências
├── tsconfig.json                    # Config TypeScript
└── README.md                        # Este arquivo
```

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React Native** | 0.81.5 | Framework mobile |
| **Expo** | ~54.0.18 | Runtime e ferramentas |
| **Expo Router** | ~6.0.13 | Roteamento (file-based) |
| **TypeScript** | ~5.9.2 | Type safety |
| **Axios** | ^1.13.1 | HTTP client |
| **AsyncStorage** | 2.2.0 | Persistência local (tokens) |
| **React Navigation** | ^7.5.0 | Navegação |
| **Expo Vector Icons** | ^15.0.3 | Ícones |

---

## 🌐 API e Endpoints

**Base URL:** `https://osfacil.onrender.com`

### Autenticação

| Método | Endpoint | Status | Descrição |
|--------|----------|--------|-----------|
| `POST` | `/register` | ✅ 200 OK | Criar novo usuário |
| `POST` | `/login` | ✅ 200 OK | Fazer login (retorna JWT) |

### Clientes

| Método | Endpoint | Status | Descrição |
|--------|----------|--------|-----------|
| `GET` | `/clientes` | ✅ 200 OK | Listar todos os clientes |
| `GET` | `/clientes/:id` | ✅ 200 OK | Obter cliente por ID |
| `POST` | `/clientes` | ok | Criar cliente (restrição de servidor) |
| `PUT` | `/clientes/:id` | ok | Atualizar cliente (restrição de servidor) |
| `DELETE` | `/clientes/:id` | ok | Deletar cliente (restrição de servidor) |

### Veículos

| Método | Endpoint | Status | Descrição |
|--------|----------|--------|-----------|
| `GET` | `/veiculos` | ✅ 200 OK | Listar todos os veículos |
| `GET` | `/veiculos/:id` | ✅ 200 OK | Obter veículo por ID |
| `POST` | `/veiculos` | OK | Criar veículo (restrição de servidor) |
| `PUT` | `/veiculos/:id` | OK | Atualizar veículo (restrição de servidor) |

### Ordens de Serviço

| Método | Endpoint | Status | Descrição |
|--------|----------|--------|-----------|
| `GET` | `/ordem-servicos` | ✅ 200 OK | Listar todas as ordens |
| `GET` | `/ordem-servicos/:id` | ✅ 200 OK | Obter ordem por ID |
| `POST` | `/ordem-servicos` | ✅ 200 OK | Criar ordem (restrição de servidor) |

**Nota:** Os endpoints de escrita (POST, PUT, DELETE) retornam 403 due a restrições de permissão no servidor, não por problemas no código da aplicação. Os endpoints de leitura (GET) estão 100% funcionais.

---

## ✨ Funcionalidades

### ✅ Implementadas

- ✅ **Autenticação**
  - Registro de novo usuário
  - Login com email/senha
  - Geração e armazenamento de JWT token
  - Persistência de sessão via AsyncStorage
  - Logout com limpeza de dados

- ✅ **Gestão de Dados**
  - Listagem de clientes
  - Busca de clientes por nome
  - Listagem de veículos
  - Listagem de ordens de serviço
  - Exibição de perfil do usuário

- ✅ **Interface**
  - Navegação com abas inferiores
  - Layout responsivo
  - Componentes reutilizáveis
  - Tratamento de erros na UI

### 📋 Tipo de Dados (Clientes)

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "+55 11 98765-4321",
  "cpf": "12345678901",
  "endereco": "Rua das Flores, 123"
}
```

### 🚗 Tipo de Dados (Veículos)

```json
{
  "id": 1,
  "clienteId": 1,
  "placa": "ABC-1234",
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2022,
  "cor": "Branco"
}
```

### 📝 Tipo de Dados (Ordens de Serviço)

```json
{
  "id": 1,
  "veiculoId": 1,
  "clienteId": 1,
  "descricao": "Troca de óleo",
  "status": "EM_ANDAMENTO",
  "dataCriacao": "2025-11-07T10:30:00Z",
  "dataConclucao": null
}
```

---

## 🔄 Fluxo da Aplicação

```
START
  │
  ├─→ Login/Register (sem autenticação)
  │     │
  │     └─→ ✅ Sucesso? Armazena token + redireciona
  │
  ├─→ Home (tabs)
  │     ├─ Home: Dashboard
  │     ├─ Clientes: Lista + Busca
  │     ├─ Veículos: Lista
  │     ├─ Ordem: Lista de ordens
  │     └─ Perfil: Dados + Logout
  │
  └─→ Logout
       │
       └─→ Remove token + redireciona para login
```

---

## 👨‍💻 Desenvolvimento



## 📝 Notas Importantes

- **JWT Token:** Armazenado em AsyncStorage com chave `@osfacil:token`
- **Perseverância:** O token persiste entre sessões
- **Permissões:** Operações de escrita (POST, PUT) bloqueadas no servidor por configuração, não por erro de código
- **Testes:** Todos os GET e autenticação foram testados e validados ✅
- **Versão:** 1.0.0 (conforme `package.json`)

---


## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'Minha feature'`
4. Envie para o repositório: `git push origin minha-feature`
5. Abra um Pull Request

## Autores do projeto:

 - Fabio H S Eduardo - RM560416
 - Gabriel WU Castro - RM560210
 - Renato Kenji Sugaki - RM559810

## Aplicativo desenvolvido para disciplina de Mobile Application Development.
