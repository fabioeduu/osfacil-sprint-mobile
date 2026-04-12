# OS Facil

Aplicativo mobile para gestao de oficina automotiva, com foco em ordens de servico, clientes e veiculos, integrando backend HTTP e funcionalidade exposta por Oracle APEX.

## Problema Escolhido
Oficinas pequenas perdem produtividade por falta de um fluxo centralizado para:
- cadastrar clientes e veiculos;
- abrir e acompanhar ordens de servico;
- buscar ordens por status, numero e defeito;
- manter sessao autenticada para acesso seguro.

## Solucao Proposta
O app OS Facil implementa os fluxos principais do processo operacional da oficina com:
- autenticacao real com login e persistencia de sessao;
- navegacao por rotas com Expo Router;
- CRUD integrado por HTTP para clientes, veiculos e ordens;
- estados de carregamento e atualizacao automatica via TanStack Query;
- consumo de endpoint Oracle APEX como parte de funcionalidade de negocio.

## Tecnologias Utilizadas
- React Native
- Expo
- Expo Router
- TypeScript
- Axios
- TanStack Query
- AsyncStorage
- Oracle APEX REST API

## Arquitetura do Projeto
Estrutura principal:
- src/app: telas e rotas (UI)
- src/components: componentes reutilizaveis
- src/hooks: hooks de dados e estado de tela
- src/api: servicos HTTP
- src/contexts: contexto de autenticacao
- src/theme: tema claro/escuro/sistema
- src/providers: providers globais (React Query, tema, auth)

Separacao de responsabilidades:
- UI em telas e componentes;
- regra de dados em hooks;
- acesso HTTP em servicos dedicados.

## Requisitos da Sprint 3 Cobertos
- Navegacao funcional com rotas explicitas e 6+ telas.
- Integracao HTTP real com dados vindos da API.
- CRUD acessivel pela interface (clientes, veiculos, ordens).
- Login com sessao persistida e rotas protegidas.
- Atualizacao automatica da interface apos create/update/delete.
- Tema claro/escuro/sistema implementado e demonstravel.

## Integracao com API
Base URL:
- https://osfacil.onrender.com

Principais rotas consumidas:
- POST /login
- POST /register
- GET/POST/PUT/DELETE /clientes
- GET/POST/PUT/DELETE /veiculos
- GET/POST/PUT/DELETE /ordem-servicos

Observacao:
- se o backend estiver indisponivel ou com restricao de permissao, o app exibe erro real e nao utiliza dados mockados.

## Integracao Oracle APEX
Funcionalidade APEX (definida pelo grupo):
- [DESCREVER A REGRA DE NEGOCIO NO APEX]

Endpoint REST do APEX:
- [INFORMAR ENDPOINT APEX]

Como o app consome:
- [DESCREVER A TELA/FUNCIONALIDADE QUE CHAMA O APEX]

Impacto funcional:
- a funcionalidade depende da API APEX para concluir o fluxo.

## Como Executar
Pre-requisitos:
- Node.js 18+
- npm
- Expo CLI

Instalacao:
1. npm install

Execucao:
1. npm start
2. npm run android
3. npm run ios
4. npm run web

## Credenciais de Teste
- Email: [SEU_EMAIL_DE_TESTE]
- Senha: [SUA_SENHA_DE_TESTE]

## Video de Apresentacao
Link YouTube (maximo 5 minutos, com narracao):
- [COLOCAR_LINK_YOUTUBE_AQUI]

Checklist do video:
- navegacao entre telas;
- login e controle de acesso;
- integracao HTTP com operacoes reais;
- funcionalidade Oracle APEX em uso;
- app funcionando ponta a ponta.

## Integrantes
- [NOME 1]
- [NOME 2]
- [NOME 3]
