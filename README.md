<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# CodeFlow - Backend

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [ ] Deve ser possível atualizar os dados da conta cadastrada;
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
- [ ] Deve ser possível comentar posts;
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
- [ ] O usuário não pode comentar em posts privados;
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
- [ ] Os comentários devem suportar markdown;
- [x] Todos os componentes precisam ser responsivos;
- [x] Os componentes que precisam consumir dados já na sua inicialização deve estar protegido por um fallback usando Skeleton;
- [x] Os loadings para atualização de dados de componentes já criados deve usar um spinner;
- [x] Toda lista de dados deve ter suporte a filtragem;
- [x] Toda ação de deleção deve passar por uma dupla checagem.
