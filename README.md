# CodeFlow - Backend

## RFs (Requisitos funcionais)

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível que o usuário apague sua conta;
- [ ] Deve ser possível que o usuário altere os dados de sua conta;
- [ ] Deve ser possível compartilhar flows(nome do arquivo de config.)
- [ ] Deve ser possível que o usuário obtenha seu histórico de publicações;
- [ ] Deve ser possível que o usuário busque por flows(nome do arquivo de config.);
- [ ] Deve ser possível que o usuário busque flows(nome do arquivo de config.) pelo nome;
- [ ] Deve ser possível que o usuário busque flows(nome do arquivo de config.) pelo autor;
- [ ] Deve ser possível que o usuário realize o download de uma flow(nome do arquivo de config.);
- [ ] Deve ser possível escolher a visibilidade do flow (público ou privado);
- [ ] Deve ser possível que o usuário consulte seus próprios dados (LGPD); 
- [ ] Deve ser possível que o usuário acesse o perfil de outros usuários; 

## RNs (Regras de negócio)

- [ ] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] O usuário não deve poder se cadastrar com a mesma conta usada para oauth;
- [ ] O usuário não pode fazer postagens com nomes repetidos;
- [ ] O usuário não pode acessar um flow privado, caso não seja o do próprio usuário;
- [ ] Apenas o próprio usuário pode alterar a visibilidade do post;
- [ ] A academia só pode ser cadastrada por administradores;
- [ ] O usuário pode criar um flow sem estar logado
- [ ] O usuário não pode postar um flow sem estar logado
- [ ] O usuário pode fazer o download de um flow sem estar logado

## RNFs (Requisitos não funcionais)

- [ ] A senha do usuário precisa estar criptografada usando hashing;
- [ ] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);