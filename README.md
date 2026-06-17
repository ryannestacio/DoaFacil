# DoaFácil

O **DoaFácil** é um aplicativo criado em React Native para ajudar pessoas a encontrarem um destino melhor para itens que ainda podem ser úteis. A proposta é simples: quem tem algo para doar cadastra o item, e quem precisa pode consultar as doações disponíveis de forma rápida e organizada.

## Integrante

- Ryan Estácio dos Santos
- Matrícula: 202302293085

## Problema social escolhido

O projeto DoaFácil busca solucionar a dificuldade de conectar pessoas que desejam doar itens com aquelas que precisam recebê-los.

Muitas roupas, móveis, alimentos e objetos em bom estado acabam sem destino adequado, enquanto famílias em situação de vulnerabilidade necessitam desses recursos. O aplicativo facilita o cadastro e a consulta de doações, incentivando a solidariedade e reduzindo o desperdício.

## O que o aplicativo faz

- Cadastra itens disponíveis para doação.
- Lista as doações salvas no aplicativo.
- Permite editar informações de uma doação cadastrada.
- Permite excluir itens que ainda estão disponíveis.
- Permite marcar um item como pego, deixando-o indisponível.
- Salva os dados localmente com SQLite.

## Tecnologias utilizadas

- React Native
- Expo SDK 56
- Expo Router
- Expo SQLite
- TypeScript

## Como rodar o projeto

Primeiro, clone o repositório ou abra a pasta do projeto no computador.

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Depois disso, escolha como deseja abrir o aplicativo:

- Pressione `a` para abrir no emulador Android.
- Pressione `w` para abrir no navegador.
- Escaneie o QR Code com o aplicativo Expo Go no celular.

## Estrutura principal

- `src/app/index.tsx`: tela principal do aplicativo, com cadastro, listagem, edição e remoção de doações.
- `src/app/explore.tsx`: tela com um resumo do projeto e dos requisitos atendidos.
- `src/app/_layout.tsx`: configuração das abas e do banco SQLite.
- `src/database/donations.ts`: funções responsáveis por criar, listar, atualizar e excluir registros.
- `src/types/donation.ts`: tipos usados para representar uma doação no código.
