# Testes Unitários em Node.js

Testes unitários são cruciais para garantir a confiabilidade e correção de componentes individuais em uma aplicação Node.js. Eles envolvem testar pequenas unidades de código isoladas, como funções ou métodos, para verificar se elas se comportam como esperado.

## Padrão de Banco de Dados em Memória (In-Memory Database Pattern)

O padrão de banco de dados em memória é frequentemente usado em testes unitários para evitar dependências de bancos de dados externos. Ele envolve o uso de um banco de dados leve em memória (por exemplo, SQLite no modo in-memory) para simular interações com o banco de dados durante os testes. Essa abordagem oferece vários benefícios:

- **Isolamento:** Os testes são isolados do banco de dados real, prevenindo corrupção de dados ou efeitos colaterais não intencionais.
- **Velocidade:** Bancos de dados em memória são significativamente mais rápidos do que bancos de dados baseados em disco, resultando em uma execução de teste mais rápida.
- **Reprodutibilidade:** Os testes são mais reproduzíveis porque não dependem do estado de um banco de dados externo.

## Exemplo Prático no Projeto

Vamos usar como exemplo o caso de uso de registro de usuário (`RegisterUseCase`) para ilustrar como os testes unitários são aplicados neste projeto, seguindo o padrão de banco de dados em memória.

### 1. Abstração do Repositório

Primeiro, definimos uma interface para o repositório de usuários. Isso permite que o caso de uso dependa de uma abstração, não de uma implementação concreta, seguindo o Princípio da Inversão de Dependência (SOLID).

`src/repositories/IUsersRepository.ts`

```typescript
import { Prisma, User } from '@prisma/client';

export interface IUsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
```

### 2. Implementação do Repositório em Memória

Para os testes, criamos uma implementação "em memória" do repositório de usuários. Esta classe simula o comportamento do banco de dados, mas armazena os dados em um array na memória, garantindo que os testes sejam rápidos e isolados.

`src/repositories/in-memory-users-repository.ts`

```typescript
import { Prisma, User } from '@prisma/client';
import { IUsersRepository } from './IUsersRepository';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'uuid gerado automaticamente',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
}
```

### 3. Caso de Uso (Use Case)

O caso de uso `RegisterUseCase` recebe uma instância de `IUsersRepository` em seu construtor. Durante a execução dos testes, injetaremos o `InMemoryUsersRepository`. Em produção, injetaríamos a implementação que interage com o banco de dados real (usando Prisma).

`src/use-cases/register.ts`

```typescript
import { hash } from 'bcryptjs';
import { IUsersRepository } from 'repositories/IUsersRepository';
import { UserAlreadyExistsError } from './errors/user-already-exists';
// ... outros imports

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: RegisterUserCaseRequest): Promise<RegisterUseCaseResponse> {
    const { name, email, password } = data;
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
```

### 4. Escrevendo o Teste Unitário

Finalmente, o teste unitário para o `RegisterUseCase` utiliza o `InMemoryUsersRepository` para testar a lógica de negócio de forma isolada, sem a necessidade de um banco de dados real.

`src/use-cases/register.test.ts`

```typescript
import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register.js';
import { InMemoryUsersRepository } from 'repositories/in-memory-users-repository.js';
import { UserAlreadyExistsError } from './errors/user-already-exists.js';

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    // Prepara o ambiente do teste com o repositório em memória
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    // Executa o caso de uso
    const { user } = await registerUserCase.execute({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password: '123456',
    });

    // Valida o resultado
    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to register with same email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const userEmail = 'john.doe@mail.com';

    // Cria um usuário para simular a duplicidade
    await registerUserCase.execute({
      name: 'John Doe',
      email: userEmail,
      password: '123456',
    });

    // Tenta registrar novamente com o mesmo e-mail e espera um erro
    expect(() => {
      return registerUserCase.execute({
        name: 'John Doe',
        email: userEmail,
        password: '123456',
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
```

Neste exemplo, cada teste cria uma nova instância do `InMemoryUsersRepository`, garantindo que os testes sejam executados em um ambiente limpo e isolado, sem interferência entre eles.

## Benefícios dos Testes Unitários

- Detecção precoce de bugs
- Melhora da qualidade do código
- Refatoração mais fácil
- Melhor documentação
- Confiança na qualidade do código
