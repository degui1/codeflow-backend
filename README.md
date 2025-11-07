# Codeflow (Backend)

> The goal of this project is to develop a platform that mitigates the difficulties and simplifies the creation of YAML files in an intelligent, guided, and explanatory way. The proposal aims to support especially beginner developers by offering a more accessible and user-friendly experience, reducing the learning curve.

## Main Project Objectives

* Build a web application for assisted and intelligent creation, editing, and sharing of YAML files;
* Reduce the learning curve for technologies that use YAML to automate workflows, such as GitHub Actions;
* Increase team productivity when structuring new projects.

## 🚀 Key Features

Main features of **Codeflow**:

* Create valid **YAML** files using an intuitive interface;
* Understand YAML logic through tutorials and **real-time feedback**;
* Avoid indentation and formatting errors with **built-in syntax validation**;
* **Build pipelines quickly** with preconfigured blocks for popular tools;
* **Export your YAML files** ready for CI/CD tools such as GitHub Actions;
* Gain proficiency in YAML through hands-on construction of real pipelines.

## 📋 Environment Variables

### Node

* **PORT**: Port where the server will run (default: `3333`).
* **NODE_ENV**: Execution environment (default: `development`).

### Paths

* **TEMPORARY_FOLDER**: Path to the temporary folder (default: `./temp/`)
* **LOG_FOLDER**: Path to the log folder (default: `./temp/logs/`)
* **FILES_FOLDER**: Path to the files folder for downloads (default: `./temp/files/`)
* **ERROR_LOG_FILENAME**: Error log filename (default: `error_log.log`)
* **LOG_FILENAME**: Log filename (default: `logs.log`)

### Prisma ORM

* **DATABASE_URL**: Database connection URL using **PostgreSQL**. Example:

  ```env
  DATABASE_URL="postgresql://youruser:somepassword@localhost:5432/yourdb?schema=public"
  ```

### OAuth

#### Discord

* **DISCORD_CLIENT_ID**:
* **DISCORD_CLIENT_SECRET**:
* **DISCORD_REDIRECT_URI**:

#### GitHub

* **GITHUB_CLIENT_ID**:
* **GITHUB_CLIENT_SECRET**:
* **GITHUB_REDIRECT_URI**:

> **Note**: You must fill in the OAuth variables for login to work. Follow the documentation of each platform to learn how to generate them.

## Docker

This project uses **docker-compose** to run the database.

## 📋 Development Scripts

```bash
## Runs the server in development mode.
pnpm dev
```

## FRs (Functional Requirements)

* [x] It must be possible to register an account;
* [x] It must be possible to authenticate;
* [x] It must be possible to update registered account data;
* [x] It must be possible to delete a user account;
* [x] It must be possible to create a community post;
* [x] It must be possible to create a Flow;
* [x] It must be possible to view posts already created by the community;
* [x] It must be possible to retrieve the profile of a logged-in user;
* [x] It must be possible for the user to view their publication history;
* [x] It must be possible for the user to search for flows;
* [x] It must be possible for the user to download a flow;
* [x] It must be possible to choose a post’s visibility;
* [x] It must be possible for the user to access other users’ profiles;
* [x] It must be possible for the user to add a description to a post;
* [x] It must be possible to like posts;
* [x] It must be possible to edit an existing post;
* [x] It must be possible to edit an existing flow.

---

## BRs (Business Rules)

* [x] A user must not be able to register with a duplicate email;
* [x] A user must not be able to register using an account already used for OAuth;
* [x] A user cannot access a private flow unless it is their own;
* [x] Only the post owner can change its visibility;
* [x] A user can create a flow without being logged in;
* [x] A user cannot publish a flow without being logged in;
* [x] A user can download a flow without being logged in;
* [x] A user cannot manage a post that is not their own;
* [x] A user can only manage their own account;
* [x] A user can only edit flows they created;
* [x] A user cannot complete the creation of a flow unless all fields are validated;
* [x] A user cannot input arbitrary values in flow fields with predefined options — only the predefined ones can be selected;
* [x] A user can only explore public posts in the community;
* [x] A user can only view another user’s public post history.

---

## NFRs (Non-Functional Requirements)

* [x] The application data must be persisted in a PostgreSQL database;
* [x] All data lists must be paginated with 20 items per page;
* [x] The user must be identified via cookies;
* [x] Post descriptions must be written in markdown;
* [x] All components must be responsive;
* [x] Components that require data on initialization must be protected by a Skeleton fallback;
* [x] Loading states for updating existing component data must use a spinner;
* [x] Every data list must support filtering;
* [x] Every deletion action must go through a double confirmation.

---

<br />
<br />
<br />
<br />

# Codeflow (Backend) - PT-BR 

>O objetivo deste trabalho é desenvolver uma plataforma que mitigue as dificuldades e facilite a criação de arquivos YAML de forma inteligente, guiada e explicativa. A proposta busca apoiar, sobretudo, desenvolvedores iniciantes, oferecendo uma experiência mais acessível, amigável e reduzindo a curva de aprendizado.

## Principais objetivos do projeto:

- Criar uma aplicação web para criação, edição e compartilhamento de arquivos YAML de forma assistida e inteligente;
- Reduzir a curva de aprendizado em tecnologias que utilizam YAML para automatizar fluxos de trabalho, como o GitHub Actions;
- Aumentar a produtividade das equipes na estruturação de novos projetos;

## 🚀 Funcionalidades Principais

Principais funcionalidades do **Codeflow**:

- Crie arquivos **YAML** válidos usando uma interface intuitiva;
- Entenda a lógica do YAML através de tutoriais e **feedback em tempo real**;
- Evite erros de indentação e formatação com a **validação de sintaxe integrada**;
- **Monte pipelines rapidamente** com blocos pré-configurados para as ferramentas mais populares;
- **Exporte seus arquivos** YAML prontos para ferramentas de CI/CD, como GitHub Actions;
- Adquira proficiência em YAML, com a construção prática de pipelines reais.

## 📋 Variáveis de Ambiente

### Node

* **PORT**: Porta onde o servidor irá rodar (padrão `3333`).
* **NODE\_ENV**: Ambiente de execução (padrão `development`).

### Paths

* **TEMPORARY_FOLDER**: Caminho da pasta temporária (padrão `./temp/`)
* **LOG_FOLDER**: Caminho da pasta de logs (padrão `./temp/logs/`)
* **FILES_FOLDER**: Caminho da pasta de files para download (padrão `./temp/files/`)
* **ERROR_LOG_FILENAME**: Nome do arquivo de log para erro (padrão `error_log.log`)
* **LOG_FILENAME**: Nome do arquivo de log (padrão `logs.log`)

### Prisma ORM

* **DATABASE\_URL**: URL de conexão com o banco de dados, usando o **PostgreSQL**. Exemplo:

  ```env
  DATABASE_URL="postgresql://youruser:somepassword@localhost:5432/yourdb?schema=public"
  ```

### OAuth

#### Discord

* **DISCORD_CLIENT_ID**:
* **DISCORD_CLIENT_SECRET**:
* **DISCORD_REDIRECT_URI**:

#### GitHub

* **GITHUB_CLIENT_ID**:
* **GITHUB_CLIENT_SECRET**:
* **GITHUB_REDIRECT_URI**:

>**Nota**: É preciso preencher as vars de OAuth para que o login funcione. Siga a documentação de ambas as ferramentas para saber como gerar.

## Docker

Este projeto utiliza o **docker-compose** para rodar o banco de dados.

## 📋 Scripts de Desenvolvimento

```bash
## Executa o servidor em modo de desenvolvimento.
pnpm dev
```

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível atualizar os dados da conta cadastrada;
- [x] Deve ser possível excluir a conta do usuário;
- [x] Deve ser possível criar um post para a comunidade;
- [x] Deve ser possível criar um Flow;
- [x] Deve ser possível consultar os posts já criados pela comunidade;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível que o usuário obtenha seu histórico de publicações;
- [x] Deve ser possível que o usuário busque por flows;
- [x] Deve ser possível que o usuário realize o download de uma flow;
- [x] Deve ser possível escolher a visibilidade do post;
- [x] Deve ser possível que o usuário acesse o perfil de outros usuários;
- [x] Deve ser possível que o usuário adicione uma descrição a um post;
- [x] Deve ser possível curtir posts;
- [x] Deve ser possível editar um post já criado;
- [x] Deve ser possível editar um flow já criado.

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não deve poder se cadastrar com a mesma conta usada para oauth;
- [x] O usuário não pode acessar um flow privado, caso não seja o do próprio usuário;
- [x] Apenas o próprio usuário pode alterar a visibilidade do post;
- [x] O usuário pode criar um flow sem estar logado;
- [x] O usuário não pode postar um flow sem estar logado;
- [x] O usuário pode fazer o download de um flow sem estar logado;
- [x] O usuário não pode gerenciar um post que não seja de sua autoria;
- [x] O usuário só pode gerenciar sua própria conta;
- [x] O usuário só pode editar um flow de sua autoria;
- [x] O usuário não pode baixar concluir a criação de um flow sem que todos os campos tenham sido validados;
- [x] O usuário não pode inserir qualquer valor em campos do flow com valores pré-definidos, devendo apenas selecionar os pré-configurados;
- [x] O usuário só pode explorar posts públicos na comunidade;
- [x] O usuário só pode visualizar o histórico de posts públicos de outro usuário.

## RNFs (Requisitos não funcionais)

- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado via cookies;
- [x] A descrição dos posts deve ser feita em markdown;
- [x] Todos os componentes precisam ser responsivos;
- [x] Os componentes que precisam consumir dados já na sua inicialização deve estar protegido por um fallback usando Skeleton;
- [x] Os loadings para atualização de dados de componentes já criados deve usar um spinner;
- [x] Toda lista de dados deve ter suporte a filtragem;
- [x] Toda ação de deleção deve passar por uma dupla checagem.

