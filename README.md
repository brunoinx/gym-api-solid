# App - Gerenciamento de registros em idas a academias

Gympass style app.

## RFs - Requisitos Funcionais
- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil do usuário logado;
- [ ] Deve ser possível realizar check-in enquanto usuário logado;
- [ ] Deve ser possível obter o número de checks-in realizados pelo usuário;
- [ ] Deve ser possível obter os registros de check-ins;
- [ ] Deve ser possível realizar a busca por academias próximas ao usuário;
- [ ] Buscar academias por nome;
- [ ] Validar o check-in de um usuário pela academia;
- [ ] Deve ser possível cadastrar uma academia.

## RNs - Regras de Negócio
- [ ] O usuário não deve poder se cadastrar com email duplicado;
- [ ] O usuário não pode fazer 2 check-ins no mesmo dia;
- [ ] O usuário não pode fazer check-in se não estiver perto de uma academia (100m de distância);
- [ ] O check-in só pode ser validado até 20min após sua realização;
- [ ] O check-in pode ser validado por administradores.
- [ ] A academia só pode ser cadastrada por administradores.
 
## RNFs - Requisitos Não Funcionais
- [ ] A senha deve estar criptografada;
- [ ] Banco de dados PostgreSQL;
- [ ] Todas as listas de dados precisam ser paginadas com 20 itens por página;
- [ ] Identificar o usuário por um JWT (JSON Web Token);
