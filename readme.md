# Meetapp

App agregador de eventos para desenvolvedores Meetapp (um acrônimo de Meetup + App).

## Funcionalidades

Abaixo estão descritas as funcionalidades da aplicação.

### Autenticação

Permite que um usuário se autentique na aplicação utilizando e-mail e senha.

- Realiza a validação dos dados de entrada.
- A autenticação é feita por JWT.

### Cadastro e atualização de usuários

Permite que novos usuários se cadastrem na aplicação utilizando nome, e-mail e senha.

Para atualizar a senha, o usuário deve também enviar um campo de confirmação com a mesma senha.

- Criptografa a senha do usuário para segurança;
- Realiza a validação dos dados de entrada;

## Uso

O projeto possui uma configuração de *stack* Docker para executar a aplicação, contendo um container Node e um container Postgres. Contudo, é possível executar a aplicação sem essa *stack*, desde que o ambiente possua:

- Node
- Yarn
- Postgres

Antes de iniciar a aplicação com ou sem a *stack*, deve-se criar o arquivo contendo as configurações, utiilzando-se do arquivo `.env.example` como exemplo:

```
cp .env.example .env
```

O arquivo `.env` deve ser editado para conter valores válidos de configuração. Após isso, pode-se utilizar a *stack* Docker ou o próprio ambiente de desenvolvimento.


## Utilizando a stack Docker

### Para subir a aplicação

```
./sh/up
```

### Para instalar as dependências do projeto

```
./sh/yarn
```

### Para preparar a base de dados

```
./sh/sequelize db:migrate
```

### Para exibir os logs da aplicação

```
./sh/logs
```


## Sem a stack Docker

### Para instalar as dependências do projeto

```
yarn
```

### Para preparar a base de dados

```
yarn sequelize db:migrate
```

### Para executar a aplicação

```
yarn run dev
```

## API

`POST` `/users`

Registra um usuário

```
curl --request POST \
  --url http://localhost:3000/users \
  --header 'content-type: application/json' \
  --data '{
	"name": "User Name",
	"email": "user@localhost.com",
	"password": "abcd1234"
}'
```

---

`POST` `/sessions`

Efetua login

```
curl --request POST \
  --url http://localhost:3000/sessions \
  --header 'content-type: application/json' \
  --data '{
	"email": "user@localhost.com",
	"password": "abcd1234"
}'
```

---

`PUT`: `/users`

Atualiza os dados de um usuário

```
curl --request PUT \
  --url http://localhost:3000/users \
  --header 'authorization: Bearer <token>' \
  --header 'content-type: application/json' \
  --data '{
	  "name": "Full User Name"
  }'
```

---

`POST`: `/files`

Registra uma imagem.

```
curl --request POST \
  --url http://localhost:3000/files \
  --header 'authorization: Bearer <token>' \
  --header 'content-type: multipart/form-data; boundary=---011000010111000001101001' \
  --form file=
```

---

`POST`: `/meetups`

Registra um meetup

```
curl --request POST \
  --url http://localhost:3000/meetups \
  --header 'authorization: Bearer <token>' \
  --header 'content-type: application/json' \
  --data '{
    "title": "Meetup de Exemplo",
    "description": "Um meetup de exemplo",
    "location": "Endereço do Meetup, 123",
    "date": "2020-07-08T18:00:00-00:00",
    "banner_id": 1
  }'
```

---

`GET`: `/meetups`

Lista os meetups registrados para o usuário ativo.

```
curl --request GET \
  --url http://localhost:3000/meetups \
  --header 'authorization: Bearer <token>'
```

---

`DELETE`: `/meetups/:id`

Cancela um meetup futuro.

```
curl --request DELETE \
  --url http://localhost:3000/meetups/1 \
  --header 'authorization: Bearer <token>'
```

---

`PUT`: `/meetups/:id`

Atualiza os dados de um meetup futuro.

```
curl --request PUT \
  --url http://localhost:3000/meetups/14 \
  --header 'authorization: Bearer <token>' \
  --header 'content-type: application/json' \
  --data '{
    "title": "Meetup de Teste"
  }'
```
---

`POST`: `/meetups/:id/subscriptions`

Inscreve o usuário ativo no meetup futuro.

```
curl --request POST \
  --url http://localhost:3000/meetups/1/subscriptions \
  --header 'authorization: Bearer <token>'
```

## Desafio

Esse projeto é a realização do desafio proposto no curso **Rocketseat - Bootcamp GoStack 2019**.
