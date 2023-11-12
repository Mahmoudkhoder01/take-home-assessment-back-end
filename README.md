## APIs

### USER APIS

#### Get All Users

**API**: `GET /user`

**Description**: This API endpoint allows you to retrieve a list of all users.

**Example**:

```http
GET http://localhost:5000/user
```

#### Get User By Id

**API**: `GET /user/:id`

**Description**: This API endpoint allows you to retrieve the user by the id passed in the param.

**Example**:

```http
GET http://localhost:5000/user/:id
```

#### Create Auth User

**API**: `POST /auth/register`

**Description**: This API endpoint allows you to create a new user with the date below, and return the token.

**Object Should Passed As JSON**: `{
    "name": string,
    "email": string,
    "password": string
}`

**Example**:

```http
POST http://localhost:5000/auth/register
```

#### Login User

**API**: `POST /auth/login`

**Description**: This API endpoint allows you to login the user with the date below, and return the token.

**Object Should Passed As JSON**: `{
    "email": string,
    "password": string
}`

**Example**:

```http
POST http://localhost:5000/auth/login
```

#### Create User

**API**: `POST /user`

**Description**: This API endpoint allows you to create a new user with the date below.

**Object Should Passed As JSON**: `{
    "name": string,
    "email": string,
    "password": string
}`

**Example**:

```http
POST http://localhost:5000/user
```

#### Update User

**API**: `PUT /user/:id`

**Description**: This API endpoint allows you to edit a user by the id passed in the param.

**Object Should Passed As JSON**: `{
    "name": string,
    "email": string,
    "password": string
}`

**Example**:

```http
PUT http://localhost:5000/user/:id
```

#### Delete User

**API**: `DELETE /user/:id`

**Description**: This API endpoint allows you to delete a user by the id passed in the param.

**Example**:

```http
DELETE http://localhost:5000/user/:id
```

### TODO APIS

#### Get All Todo

**API**: `GET /todo`

**Description**: This API endpoint allows you to retrieve a list of all todos.

**Example**:

```http
GET http://localhost:5000/todo
```

#### Get Todo By Id

**API**: `GET /todo/:id`

**Description**: This API endpoint allows you to retrieve the todo by the id passed in the param.

**Example**:

```http
GET http://localhost:5000/todo/:id
```

#### Create Todo

**API**: `POST /todo`

**Description**: This API endpoint allows you to create a new todo with the date below.

**Object Should Passed As JSON**: `{
    "description": string,
    "priority": string,
    "userID": number,
    "date": string,
    "completed": boolean,
}`

**Example**:

```http
POST http://localhost:5000/todo
```

#### Update Todo

**API**: `PUT /todo/`

**Description**: This API endpoint allows you to edit a todo by the id passed in the body.

**Object Should Passed As JSON**: `{
    "id": number,
    "todo": {
        "description": string,
        "priority": string,
        "date": string,
        "completed": boolean,
     }
}`

**Example**:

```http
PUT http://localhost:5000/todo/:id
```

#### Delete Todo

**API**: `DELETE /todo/`

**Description**: This API endpoint allows you to delete a todo by the id passed in the param.

**Example**:

```http
DELETE http://localhost:5000/todo/:id
```
