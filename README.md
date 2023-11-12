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

#### Create User

**API**: `POST /user/`

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

**API**: `PUT /user/`

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

**API**: `DELETE /user/`

**Description**: This API endpoint allows you to delete a user by the id passed in the param.

**Example**:

```http
DELETE http://localhost:5000/user/:id
```
