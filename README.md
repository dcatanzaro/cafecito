# Cafecito | Damián Catanzaro

Cafecito es un proyecto hecho en Next.JS con Express.JS y MongoDB para recibir cafés ☕️ a modo de donaciones.

**Demo:** https://cafecito.damiancatanzaro.com/

**Autor:** [@DamianCatanzaro](https://twitter.com/DamianCatanzaro)

## Requerimientos

-   NodeJS
-   MongoDB

## Instalación

```
git clone https://github.com/dcatanzaro/cafecito
```

## Instalación de paquetes de NPM

```
npm install
```

## Editar el archivo .env.development para desarrollo

```
DB_HOST=localhost
DB_PORT=27017
DB_USER=
DB_PASS=
DB_NAME=cafecito

TELEGRAM_BOTID=
TELEGRAM_CHATID=

PORT=3000

ACCESS_KEY_MP=

PASSWORD_EDITOR=nuestra_password
URL=http://localhost:3000

# If you want see or hide CreatedAt field on Coffees List (components/coffee/index.js)
SHOW_DATE_COFFEE=false
```

## Para producción: crear el archivo .env con su configuración

```
DB_HOST=localhost
DB_PORT=27017
DB_USER=
DB_PASS=
DB_NAME=cafecito

TELEGRAM_BOTID=
TELEGRAM_CHATID=

PORT=3000

ACCESS_KEY_MP=

PASSWORD_EDITOR=nuestra_password
URL=http://localhost:3000

# If you want see or hide CreatedAt field on Coffees List (components/coffee/index.js)
SHOW_DATE_COFFEE=false
```

## Para correr entorno de desarrollo

```
npm run dev
```

## Para correr entorno de producción

```
npm run build
npm run start
```

## Para correr el entorno de producción con Docker

```
docker-compose up -d --build
```

## Para responder preguntas

**Lo unico que hay que hacer es pasarle por query params lo siguiente**

```
?isAdmin=true&password=nuestra_password
```

**quedando nuestra url de la siguiente manera**

```
http://localhost:3000?isAdmin=true&password=nuestra_password
```

## Para crear un link de donacion personalizado

**Hay que pasarle los datos por parametros (con los textos en formato URL-ENCODED)**

```
?title=Gracias+por+escuchar&description=Ayudame+con+un+cafe
```

**Quedando de la siguiente manera**

```
http://localhost:3000/custom-coffee?title=Gracias+por+escuchar&description=Ayudame+con+un+cafe
```

### Posibles parametros:

-   **title** - Titulo del modal
-   **description:** - Descripcion del modal
-   **message:** - Mensaje que se mostrará en el home de tu cafesito cuando efectuen una donacion
