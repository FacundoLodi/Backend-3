# Pet Adoption API

---

## Descripción

API REST desarrollada en Node.js para la gestión de un sistema de adopción de mascotas. Permite administrar usuarios, mascotas, adopciones y generar datos mock para testing.

---

## Docker

La aplicación está dockerizada y disponible en DockerHub.

Imagen:

https://hub.docker.com/r/facundolodi3/entrega-backend

### Acceso a la aplicación

```
http://localhost:8080
```

### Documentación Swagger

```
http://localhost:8080/api/docs
```

---

## Estructura del proyecto

```
src
│
├── config
│   └── db.js
│
├── docs
│   ├── swagger.js
│   └── swagger.yaml
│
├── mocks
│   ├── pet.mock.js
│   └── user.mock.js
│
├── models
│   ├── Adoption.js
│   ├── Pet.js
│   └── User.js
│
├── routes
│   ├── adoption.router.js
│   ├── mocks.router.js
│   ├── pets.router.js
│   └── users.router.js
│
├── test
│   ├── adoption.test.js
│   ├── mocks.test.js
│   ├── pets.test.js
│   └── users.test.js
│
├── app.js
└── server.js
```

---

## Documentación Swagger

La API cuenta con documentación interactiva generada con Swagger.

Acceso:

```
http://localhost:8080/api/docs
```

---

## Tests

El proyecto incluye tests funcionales utilizando Jest y Supertest.

### Ejecutar tests

```
npm test
```

### Cobertura

* Users
* Pets
* Adoptions
* Mocks

Total: **38 tests pasando correctamente**

---

## Endpoints principales

### Users

```
GET    /api/users
POST   /api/users
GET    /api/users/:uid
DELETE /api/users/:uid
```

---

### Pets

```
GET    /api/pets
POST   /api/pets
GET    /api/pets/:pid
PUT    /api/pets/:pid
DELETE /api/pets/:pid
```

---

### Adoptions

```
GET  /api/adoptions
POST /api/adoptions
GET  /api/adoptions/:aid
```

---

### Mocks

```
GET  /api/mocks/mockingpets
GET  /api/mocks/mockingusers
POST /api/mocks/generateData
```

---

## Autor

Facundo Lodi

Proyecto Final Backend