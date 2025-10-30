# JSON Web Token (JWT)

O JWT é um padrão (RFC 7519) para criar tokens de acesso que, ao contrário dos tokens de sessão tradicionais, são autocontidos e auto-verificáveis.
Funciona como um crachá de autenticação que é gerado pelo próprio servidor para permitir que o client acesse os recursos do servidor.

## Motivação

O Token JWT (JSON Web Token) é de natureza `stateless`. Isso significa que ele não é armazenado em um banco de dados pelo servidor, em vez disso, o servidor possui uma chave de acesso que autentica o toke, e que é guardado de forma segura no servidor (geralmente em variáveis de ambiente).

## Estrutura do JWT (Header, Payload, Signature)

Um JWT é uma hash (string) longa dividida em 3 partes separadas por ponto.

- **Header**: informações sobre o algoritmo de criptografia e o tipo de token (JWT) usado para assinatura:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- **Payload (Carga útil/corpo)**: Contém as "claims" (informações/alegações) sobre o usuário e metadados do token.

Claims comuns:

- **sub (subject)**: o identificador do usuário
- **exp (expiration)**: a data de expiração do token
- **iat (issued at)**: a data de emissão do token
- Informações específicas da sua aplicação (ex: user_role, id).

- **Signature (assinatura)**: É o que torna o token seguro. É criada usando o Header, o Payload e uma chave que somente o servidor `conhece`.

## Refresh Token

A segurança de um JWT resite no tempo de expiração do token, que geralmente é um tempo curto e reduz as possibilidades de ataque ao servidor por esse curto período de tempo.
Entretanto, um tempo de vida curto força o usuário a fazer login repetidamente, o que é péssimo para a usabilidade. Sendo assim, para continuar com a segurança do token e resolver o problema de usabilidade causado pela expiração, o refresh token foi criado.

### Como Funciona

O refresh token funciona da seguinte maneira:

1. Ao fazer login com sucesso, o servidor envia dois tokens: o access token e o refresh token.
2. O access token é usado para autenticar o usuário e autorizar o acesso aos recursos do servidor.
3. O refresh token é usado APENAS para renovar o access token quando ele expirar (contém um tempo de expiração mais longo).

> **⚠️Obs**: Importante ressaltar que o refresh token não é um JWT e não pode ser usado para obter recursos do servidor. Serve apenas para obter um novo access token quando o antigo expirar.
