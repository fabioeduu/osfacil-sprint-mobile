# OS Fácil - Sistema de Gerenciamento Automotivo

Um aplicativo React Native para gerenciamento de ordens de serviço automotivas, desenvolvido com Expo e TypeScript.

## 🚗 Funcionalidades

### ✅ Implementadas
- **Interface moderna e profissional** com tema automotivo
- **Navegação completa** entre todas as telas
- **Gerenciamento de Ordens de Serviço**:
  - Listagem com filtros por status
  - Visualização de detalhes
  - Sistema de busca por OS, cliente ou placa
- **Gerenciamento de Clientes**
- **Gerenciamento de Veículos**
- **Catálogo de Serviços**
- **Sistema de armazenamento local** com AsyncStorage
- **Context API** para gerenciamento de estado
- **Componentes reutilizáveis**: Botões, Inputs, Modais
- **TypeScript** com tipagem completa

### Status das Ordens de Serviço
- 🔵 Aberta
- 🟡 Em Andamento
- 🟣 Aguardando Peça
- 🟢 Concluída
- 🔴 Cancelada

### Em Desenvolvimento
As seguintes funcionalidades estão prontas para implementação:
- Formulários completos para CRUD
- Geração de PDF das OS (pendente)
- Cálculo automático de valores
- Sistema de relatórios
- Backup e sincronização

## Arquitetura

osfacil/
├── App.tsx                      # Componente principal

├── app.json                      # Configuração do Expo

├── package.json                  # Dependências e scripts

├── tsconfig.json                 # Configuração TypeScript

├── assets/                       # Imagens, ícones e splash

├── components/                   # Componentes reutilizáveis

│   │   ├── Button.tsx

│   │   ├── PriorityButton.tsx

│       ├── Header.tsx

│       └── Footer.tsx


├── context/                      # Gerenciamento de estado global


│   └── AppContext.tsx


├── navigation/                   # Navegação

│   ├── AppNavigator.tsx

│   └── types.ts


├── screens/                      # Telas do aplicativo

│   ├── OS/                       # Funcionalidades de Ordem de Serviço

│   │   ├── ListaOS.tsx

│   │   ├── NovaOS.tsx

│   │   └── ...                   # Detalhes, EditarOS, etc.


└── types/                        # Tipos TypeScript e interfaces

    └── index.ts



## Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local
- **Context API** - Gerenciamento de estado
- **Expo Vector Icons** - Ícones

## Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### Instalação
1. Clone o repositório ou navegue até a pasta do projeto
2. Instale as dependências:
   ```bash
   npm install
   ```

### Executar o Aplicativo
```bash
npm start

npx expo start

npx expo start --android  
npx expo start --ios      
npx expo start --web      
```

### Testando
1. Instale o aplicativo Expo Go no seu dispositivo móvel
2. Escaneie o QR code que aparece no terminal ou navegador
3. O aplicativo será carregado no seu dispositivo

## Design e UX

O aplicativo foi desenvolvido com foco na experiência do usuário automotivo:
Foco total na praticidade:

Limpo e Profissional.

Navegação Rápida.

Dados em Cards.

Status por Cores.

Fácil de Buscar.

## Armazenamento de Dados

O aplicativo utiliza AsyncStorage para persistir dados localmente:
- Ordens de Serviço
- Clientes
- Veículos  
- Serviços

## 🔧 Próximos Passos para Desenvolvimento

1. **Implementar formulários completos**
2. **Adicionar validações**
3. **Criar sistema de relatórios**
4. **Implementar geração de PDF**
5. **Adicionar sistema de backup**
6. **Criar testes automatizados**
7. **Implementar notificações**
8. **Adicionar modo offline**


## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.


**OS Fácil** - Simplificando o gerenciamento automotivo 🚗⚙️
