# CodeFlow - Backend

## RFs (Requisitos funcionais)

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível atualizar os dados da conta cadastrada;
- [ ] Deve ser possível excluir a conta do usuário;
- [ ] Deve ser possível criar um post para a comunidade;
- [ ] Deve ser possível criar um Flow;
- [ ] Deve ser possível consultar os posts já criados pela comunidade;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível que o usuário obtenha seu histórico de publicações;
- [ ] Deve ser possível que o usuário busque por flows;
- [ ] Deve ser possível que o usuário realize o download de uma flow;
- [ ] Deve ser possível escolher a visibilidade do post;
- [ ] Deve ser possível que o usuário acesse o perfil de outros usuários;
- [ ] Deve ser possível que o usuário adicione uma descrição a um post;
- [ ] Deve ser possível comentar posts;
- [ ] Deve ser possível curtir posts;
- [ ] Deve ser possível editar um post já criado;
- [ ] Deve ser possível editar um flow já criado.

## RNs (Regras de negócio)

- [ ] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] O usuário não deve poder se cadastrar com a mesma conta usada para oauth;
- [ ] O usuário não pode acessar um flow privado, caso não seja o do próprio usuário;
- [ ] Apenas o próprio usuário pode alterar a visibilidade do post;
- [ ] O usuário pode criar um flow sem estar logado;
- [ ] O usuário não pode postar um flow sem estar logado;
- [ ] O usuário pode fazer o download de um flow sem estar logado;
- [ ] O usuário não pode gerenciar um post que não seja de sua autoria;
- [ ] O usuário não pode comentar em posts privados;
- [ ] O usuário só pode gerenciar sua própria conta;
- [ ] O usuário só pode editar um flow de sua autoria;
- [ ] O usuário não pode baixar concluir a criação de um flow sem que todos os campos tenham sido validados;
- [ ] O usuário não pode inserir qualquer valor em campos do flow com valores pré-definidos, devendo apenas selecionar os pré-configurados;
- [ ] O usuário só pode explorar posts públicos na comunidade;
- [ ] O usuário só pode visualizar o histórico de posts públicos de outro usuário.

## RNFs (Requisitos não funcionais)

- [ ] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token) usando o algoritmo RS256;
- [ ] A descrição dos posts deve ser feita em markdown;
- [ ] Os comentários devem suportar markdown;
- [ ] Todos os componentes precisam ser responsivos;
- [ ] Os componentes que precisam consumir dados já na sua inicialização deve estar protegido por um fallback usando Skeleton;
- [ ] Os loadings para atualização de dados de componentes já criados deve usar um spinner;
- [ ] Toda lista de dados deve ter suporte a filtragem;
- [ ] Toda ação de deleção deve passar por uma dupla checagem.
