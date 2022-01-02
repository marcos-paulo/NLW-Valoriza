# Criar um projeto com NODE-JS

Crie uma pasta que sera a pasta principal do projeto, navegue ate ela pelo terminal e use o comando

> yarn init -y

o comando irá criar um arquivo `package.json`, que conterá algumas informações do projeto, alem das dependencias que vierem a ser instaladas, tanto as de produção, quanto as de desenvolvimento que só são utilizadas durante o desenvolvimento.

# Adicione as dependencias

As dependencias podem ser de dois tipos que são:

### Dependencias do projeto

Serão dependencias que ficarão no projeto na quando for feito o build do projeto.

> yarn add nome_da_dependencia

### Dependencias de desenvolvimento

Serão dependencias que ficarão no projeto apenas durante o desenvolvimento, e que não vão para a produção, utilize o `-D` no final da instrução.

> yarn add nome_da_dependencia -D

# Instalar o TypeScript

Para instalar o TypeScript utilize o comando:

> yarn add typescript -D

Em seguida utilize para inicializar o TypeScript no projeto, o comando:

> yarn tsc --init

Isso irá criar o arquivo `tsconfig.json` em nosso projeto, que contem todas as configurações do typescript. Dentro do arquivo mude a propriedade `"strict": true` para `"strict": false` pois não será necessário que o javascript faça algumas checagens que serão feitas dentro do TypeScript.

## Conversão de arquivos `.ts` em `.js`

O node-js não entende Typescript, então para executar um arquivo `.ts` é necessário converte-lo em `.js` e para isso use o comando:

> yarn tsc

## Executar arquivos `.js` utilize

> node arquivo.js

## AutomateProjectExecution

Para que não seja necessário converter manualmente todos os arquivos `.ts` em `.js` para que então o node possa executá-los instale a seguinte dependencia de desenvolvimento.

> yarn add ts-node-dev -D

Adicione também no arquivo `package.json` o seguinte script:

```json
...
"license": "MIT",
"scripts": {
    "dev": "ts-node-dev src/server.ts"
},
...
```

o conteudo do arquivo `src/server.ts` será descrito mais a frente.

# Instalar Express

O Express é um framework que lida de forma simples com as requisições HTTP

- Install Express

> yarn add express

- Install Types Express para ativar o autocomplete

> yarn add @types/express -D

# Criar Arquivo `server.ts`

O arquivo `server.ts` serve para tratar todas as requisições HTTP que chegarem a API, o arquivo será criado dentro da pasta

    pasta_do_projeto/src/server.ts

O Conteudo inicial do arquivo será:

```typescript
import express from "express";

const app = express();

app.listen(3000, () => console.log("Server is running"));
```

## ProjectExecution

Após ter feito a correta instalação de todas as dependencias citadas até aqui, e a devida inserção da chave

```json
"scripts": {
    "dev": "ts-node-dev src/server.ts"
},
```

no arquivo `package.json`, conforme explicada no item [AutomateProjectExecution](#automateprojectexecution) utilize o comando

> yarn dev

para iniciar o servidor.

# Requisições HTTP

- GET => Buscar uma Informação.
- POST => Criar uma informação.
- PUT => Alterar uma informação.
- DELETE => Remover uma Informação.
- PATCH => Alterar uma Informação Especifica.

## Tipos de Parâmetros

### Routes Params

Todos aqueles parametros que fazem parte da rota e são separados por barra /

Exemplo:

> http://localhost:3000/produtos/1234567

A rota do express ficaria assim:

> "/produtos/{id}"

### Query Params

Todos aqueles parametros que vem depois de um ? e são separados por ";", estes parametros não são obrigatórios e são separados por &

Exemplo:

> http://localhost:3000/produtos?name=teclado&description=tecladobom

A rota do express ficaria assim:

> "/produtos"

### Body Params

São utilizados nos métodos POST PUT e PATCH, são os parametros que vem inseridos no corpo da requisição, e normalmente vem no formato JSON.

```json
{
    "name":"marcos"
    "email":"marcos@paulo.com.br"
}
```

# CreateRoutes

As rotas podem ser criadas dentro do arquivo `server.js` da seguinte forma.

```typescript
...
const app = express();

app.get("/foo", (request, response) => {
    return response.send("Hello Word!");
});

...
```

A forma descrita acima não é uma boa prática e deve-se utilizar um arquivo de rotas [routes.ts](src\routes.ts), que serve para tirar a responsabilidade de armazenar as rotas do [server.ts](src\server.ts), deixando assim o codigo mais limpo e legivel.

# DataBase

## Instalação

Para baixar o ORM acesse o site

> [typeorm.io](http://typeorm.io)

No site tambem e possivel identificar as principais configurações.

## Para instalar via linha de comando o typeorm e o sqlite

> yarn add typeorm reflect-metadata sqlite4

Utilizaremos a linha de comando que existe dentro da biblioteca que foi importada para o "node_modules" para executar as instruções do typeorm, para isso deve-se adicionar o trecho de codigo a seguir dentro de "scripts" no arquivo [package.json](package.json) adicione

```json
...,
"scripts": {
    "typeorm": "ts-node-dev ./node_modules/ typeorm/cli.js"
},
...,
```

Crie um arquivo `ormconfig.json` no mesmo nivel do arquivo `package.json `para colocar as configurações do banco de dados adicionando as seguintes chaves e valores, que vao garantir a que o type orm saiba onde criar e procurar os arquivos necessários ao funcionamento.

```json
{
  "type": "sqlite",
  "database": "src/database/database.sqlite",
  "migrations": ["src/database/migrations/*.ts"],
  "entities": ["src/entities/*.ts"],
  "cli": {
    "migrationsDir": "src/database/migrations",
    "entitiesDir": "src/entities"
  }
}
```

Repare que os diretorios descritos nas chaves

- `"migrations":[]` que serve para identificar onde estão os arquivos de migrations vão ser criados
- `"entities":[]` que serve para identificar onde estao os arquivos de entidades
- `"cli":[]` que serve para identificar onde a CLI irá criar os arquivos de migrations, entities.

tem de ser criados manualmente de acordo manualmente conforme necessidade para garantir o funcionamento do typeorm.

Para ter certeza voce pode usar o comando no terminal:

> yarn typeorm -help

## Connection

Para fazer a conexão com o banco de dados crie um arquivo [index.ts](src\database\index.ts), dentro do diretório database, com o trecho de codigo.

```typescript
import { createConnection } from "typeorm";
createConnection();
```

Este arquivo por sua vez deve ser importado dentro do arquivo [server.ts](src\server.ts), que tambem deve importar o `"reflect-metadata"` que é necessário para que possamos trabalhar com os @annotations

```typescript
import "reflect-metadata";
...
import "./database";
...
```

Isto será necessário para que o typeorm possa criar a conexão com o banco de dados.

## Migrations

### Para criar uma migration

> yarn typeorm migration:create -n CreateUsers

### Para executar uma migration

> yarn typeorm migration:run

### Para desfazer a ultima migration executada

> yarn typeorm migration:revert

### Migration estruture

- [Migration CreateUsers](src\database\migrations\1639241364608-CreateUsers.ts)
- [Migration CreateTags](src\database\migrations\1639875872073-CreateTags.ts)
- [Migration AlterUserAddPassword](src\database\migrations\1640039854632-AlterUserAddPassword.ts)

### Migration com foreign key

Foreign key podem ser descritas junto com a criação da tabela para que no caso de ser necessario reverter a migration, as foreign key sejam removias no drop table

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
            name: "compliments",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "user_sender",
                    type: "uuid"
                },
                {
                    name: "user_receiver",
                    type: "uuid"
                },
                {
                    name: "tag_id",
                    type: "uuid"
                },
                {
                    name: "message",
                    type: "varchar"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }
            ],
            foreignKeys: [
                {
                    name: "FKUserSenderCompliments",
                    columnNames: ["user_sender"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users",
                    onDelete: "SET NULL",
                    onUpdate: "SET NULL"
                },
                {
                    name: "FKUserReceiverCompliments",
                    columnNames: ["user_receiver"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users",
                    onDelete: "SET NULL",
                    onUpdate: "SET NULL"

                },
                {
                    name: "FKTagCompliments",
                    columnNames: ["tag_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "tags",
                    onDelete: "SET NULL",
                    onUpdate: "SET NULL"
                },
            ]
        })
    )
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("compliments")
}
```

## Entities

### Para criar uma entidade

> yarn typeorm entity:create -n NomeDaEntidade

Ou crie um arquivo na pasta de entidades e a construa manualmente.

Descomente as seguintes linhas no arquivo `tsconfig.json` para trabalhar com as anotations do typeorm

```json
"experimentalDecorators": true
"emitDecoratorMetadata": true,
```

A linha a seguir tambem no arquivo `tsconfig.json` deve ser descomentada e colocada como false para nao dar erro nas nossas entidades por falta de inicialização dos atributos, pois iremos inicializa-los de uma forma diferente.

```json
"strictPropertyInitialization": false
```

### Instale a biblioteca uuid para trabalhar com ID's do tipo uuid em nossas entidades.

> yarn add uuid
> yarn add @types/uuid -D

### Faça a importação da seguinte forma no arquivo de entidade

    import {v4 as uuid} from "uuid"

## Repository

A construção de um Repository e uma construção bem simples e no geral seguem a mesma estrutura conforme os exemplos:

- [UsersRepository](src\repositories\UsersRepositories.ts)
- [TagsRepository](src\repositories\TagsRepositories.ts)

# Service

A camada de servico deve ser criada sempre que existir regras de negócio isso vai separar melhor as responsabilidades da aplicação. Os serviços podem ser implementados de uma forma semelhante aos exemplos:

- [CreateUserService](src\services\CreateUsersService.ts)
- [CreateTagService](src\services\CreateTagService.ts)
- [AuthenticateUserService](src\services\AuthenticateUserService.ts)

# Controllers

A camada de controller serve para receber as requisições http vida do server e trata-las enviando-as para a camada de serviço quando necessário

- [CreateUserController](src\controllers\CreateUserController.ts)
- [CreateTagController](src\controllers\CreateTagController.ts)
- [AuthenticateUserController](src\controllers\AuthenticateUserController.ts)

# EnsureAdmin

É um middleware que garante que o usuário que está logado e é um administrador, a mesma lógica pode ser utilizada para implementar permissões de usuário.

- [EnsureAdmin](src\middlewares\ensureAdmin.ts)

# Tratamento de Erro

???????????????????????????????????????
Aula 3

# Authentication

Aula 4

Para encriptar a senha do usuario antes de salvar a senha no banco usaremos a biblioteca bcryptjs

> yarn add bcryptjs

Tipagens para desenvolvimento

> yarn add @types/bcryptjs -D

Apos instaladas as bibliotecas use a função hash para encriptar a senha.

```typescript
import { hash } from "bcryptjs";
...
// salt corresponde ao tamanho da criptografia geralmente igual 8
const salt = 8;
const passwordHash = await hash("password", salt);
```

Apos salvar a senha no formato hash no banco de dados, para fazer a comparação entre a senha que esta vindo da pagina de autenticação e a senha que esta salva no banco de dados utilize a seguinte função.

```typescript
import { compare } from "bcryptjs";
...
const passwordMatch = await compare("password", user.password);
```

A autenticação será feita através do JWT e para isso instalaremos a biblioteca jsonwebtoken

> yarn add jsonwebtoken

Tipagens para desenvolvimento

> yarn add @types/jsonwebtoken -D

Para gerar efetivamente o token apos fazer todas as checagens

```typescript
import { sign } from "jsonwebtoken";
...
    const payload = { email: user.email };
    const token = sign(
        payload,
        process.env.SECRET_KEY,
        {
            subject: user.id,
            expiresIn: "1d"
        }
    )
    return token;
...
```

## EnsureAuthenticated

Para garantir que o usuário está autenticado é criado um middleware que vai fazer este trabalho. Para testar se use a function verify

```typescript
import { verify } from "jsonwebtoken";
...
  try {
    // verificar a validade do token
    const decode = verify(token, process.env.SECRET_KEY);
    console.log(decode);
  } catch (err) {
    return response.status(401).end();
  }
...
```

No mesmo arquivo e possível manipular a variável **_request_** para adicionar informações relevantes, como o id do usuário que no caso deste projeto esta dentro do payload do token sob a chave SUB. Para que possamos fazer a inserção de mais um parâmetro no header do request, precisamos sobrescrever o **_request_** do **_express_**, criando um diretório dentro da pasta src com o nome **_@types_** e dentro dele um diretório com o nome **_express_** e então um arquivo com o nome **_index.d.ts_**.

```powershell
src
└─── @types
     └─── express
          └─── index.d.ts
```

No arquivo **_index.d.ts_** vai o código:

```typescript
declare namespace Express {
  export interface Request {
    user_id: string;
  }
}
```

e no arquivo **_tsconfig.json_** deve ser ajustado a chave _typeRouts_ para conter o caminho do diretório de tipos do projeto.

```json
    "typeRoots": [
      "./src/@types"
    ],
```

Agora é possível incluir um parâmetro no request.

```typescript
...
interface IPayload {
  sub: string;
}
...
    const { sub } = verify(token, process.env.SECRET_KEY) as IPayload;
    request.user_id = sub;
...
```
