# OS Fácil

 - Aplicativo mobile para gestão de oficinas automotivas, desenvolvido com React Native e Expo. O OS Fácil permite organizar e controlar ordens de serviço, clientes e veículos de forma simples, rápida e eficiente. Com uma interface intuitiva, o app facilita o cadastro, busca e acompanhamento dos serviços realizados, tornando o dia a dia da oficina mais produtivo e profissional.


## Estrutura do Projeto

```
assets/                # Imagens e recursos estáticos
src/
  types.ts             # Tipos globais
  api/                 # Comunicação com API
  app/
	 (tabs)/            # Telas principais (busca, clientes, home, ordem, perfil, veículos)
	 ...                # Telas de login, registro, layout
  components/          # Componentes reutilizáveis
  hooks/               # Hooks customizados
```

## Instalação e Execução

1. Clone o repositório:
	```bash
	git clone https://github.com/FIAP-MOBILE-2025-Agosto/2tdspa-challenge-sprint-fabioeduu.git
	cd 2tdspa-challenge-sprint-fabioeduu
	```
2. Instale as dependências:
	```bash
	npm install
	```
3. Inicie o projeto:
	```bash
	npx expo start
	```
4. Escaneie o QR code com o app Expo Go ou rode no simulador/emulador.

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- AsyncStorage
- Expo Router

## Funcionalidades

- Cadastro e busca de clientes
- Cadastro e busca de veículos
- Gerenciamento de ordens de serviço
- Autenticação de usuários

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
