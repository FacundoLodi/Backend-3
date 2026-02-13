# Endpoints -- Backend 3

------------------------------------------------------------------------

## Base URL

``` bash
http://localhost:8080
```

------------------------------------------------------------------------

## Índice

-   [Mocking](#mocking)
-   [Usuarios](#usuarios)
-   [Mascotas](#mascotas)

------------------------------------------------------------------------

# Mocking

------------------------------------------------------------------------

## Generar Usuarios Mock (NO guarda en DB)

  Método    Endpoint
  --------- ------------------------------------------------
  **GET**   `http://localhost:8080/api/mocks/mockingusers`

Genera 50 usuarios simulados\
Password encriptada (`coder123`)\
Role aleatorio (`user` o `admin`)\
Pets array vacío

------------------------------------------------------------------------

## Generar Mascotas Mock (NO guarda en DB)

  Método    Endpoint
  --------- -----------------------------------------------
  **GET**   `http://localhost:8080/api/mocks/mockingpets`

Genera mascotas simuladas\
Especie aleatoria\
Fecha de nacimiento aleatoria

------------------------------------------------------------------------

## Generar e Insertar Datos en la Base

  Método     Endpoint
  ---------- ------------------------------------------------
  **POST**   `http://localhost:8080/api/mocks/generateData`

### Body (JSON)

``` json
{
  "users": 10,
  "pets": 15
}
```

Genera la cantidad indicada\
Inserta los registros en MongoDB Atlas\
Devuelve mensaje de confirmación

------------------------------------------------------------------------

# Usuarios

------------------------------------------------------------------------

## Obtener Todos los Usuarios (Guardados en DB)

  Método    Endpoint
  --------- -----------------------------------
  **GET**   `http://localhost:8080/api/users`

Devuelve todos los usuarios almacenados en MongoDB.

------------------------------------------------------------------------

# Mascotas

------------------------------------------------------------------------

## Obtener Todas las Mascotas (Guardadas en DB)

  Método    Endpoint
  --------- ----------------------------------
  **GET**   `http://localhost:8080/api/pets`

Devuelve todas las mascotas almacenadas en MongoDB.