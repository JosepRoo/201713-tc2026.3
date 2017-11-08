# Juego de gato web distribuido

Esta es una aplicación web de Node que implementa el tradicional juego de gato. Permite que múltiples parejas de jugadores jueguen simultáneamente.

El software se distribuye bajo la licencia GPLv3. Ver el archivo `gato/licence.txt` para más detalles.

Las instrucciones de este documento son para la plataforma Cloud9.

## 0. Requisitos

Para poder ejecutarse se requiere tener instalado el siguiente software:

- Node 4.4.*
- MongoDB 2.6.*

## 1. Instalación

La aplicación requiere instalar varios módulos de Node. Teclea el siguiente comando desde la terminal dentro del directorio `gato`:

    npm install

## 2. Corriendo los servidores

Primero se debe arrancar el servior de MongoDB. En una terminal teclea:

    mongod --nojournal

No es necesario crear explícitamente la base de datos ni las colecciones.

Posteriormente, teclea en otra terminal dentro del directorio `gato` el siguiente comando:

    npm start

## 3. Corriendo el cliente de texto

Para correr el cliente de texto (suponiendo que el servidor está corriendo en la misma máquina en el puerto `$PORT`), en una terminal disponible dentro del directorio `gato` teclea lo siguiente:

      npm run-script cliente

## 4. Corriendo el cliente web

En un navegador, ir al URL: `http://nombre-del-servidor/gato/`. Si se desea jugar en la misma computadora, se requerirán al menos dos navegadores distintos (por ejemplo Firefox y Chrome) o un mismo navegador abriendo una segunda ventana en modo incógnito.

Un mismo juego puede usar un cliente web y el otro cliente de modo texto.

## 5. Usando curl como cliente

Es posible utilizar la utilería `curl` para realizar manualmente desde una terminal la interacción de un cliente con el servidor. Todas las respuestas producidas están en formato JSON.


### Crear un juego

Para crear un nuevo juego llamado `Alfa`:

    curl -X POST -d 'nombre=Alfa' -c cookies.txt \
    http://localhost:8080/gato/crear_juego/

Si no existe un juego con ese nombre la salida debe ser:

    {
     "creado":true,
     "codigo":"bien",
     "simbolo":"X"
    }

### Estado de un juego

Para ver el estado actual del juego:

    curl -b cookies.txt http://localhost:8080/gato/estado/
    
La salida esperada para un juego recién creado es:

    {
     "estado":"espera",
     "tablero":[[" "," "," "],[" "," "," "],[" "," "," "]]
    }
    
### Juegos existentes

Para ver los juegos existentes a los que se puede unir un nuevo cliente:

    curl http://localhost:8080/gato/juegos_existentes/
    
La salida debe ser similar a:

    [
     {
      "id":"5a036be651b1ff0c60c1e5c3",
      "nombre":"Alfa"
     },
     {
      "id":"5a036def51b1ff0c60c1e5c5",
      "nombre":"Beta"
     }
    ]

### Unirse a un juego

Para unirse a un juego existente:

    curl -X PUT -d 'id_juego=5a036be651b1ff0c60c1e5c3' \
    -c cookies2.txt http://localhost:8080/gato/unir_juego/
    
La salida debe ser:

    {
     "unido":true,
     "codigo":"bien",
     "simbolo":"O"
    }
     
### Realizar un tiro

Para tirar en el centro (renglón 1, columna 1) del tablero del juego en curso:

    curl -X PUT -d 'ren=1&col=1' -b cookies.txt \
    http://localhost:8080/gato/tirar/

La salida debe ser:

    {
     "efectuado":true,
     "tablero":[[" "," "," "],[" ","X"," "],[" "," "," "]]
    } 

## 6. Interactuando con la base datos

Para inspeccionar la base de datos de MongoDB, desde la terminal teclear:

    mongo

Dentro del shell de mongo, teclear:

      > use gato
      > db.juegos.find()
      > db.jugadors.find()

Si existen instancias de juegos o jugadores que no se eliminaron correctamente al concluir un juego, es posible eliminar manualmente todo el contenido de las colecciones desde el shell de mongo:

    > use gato
    > db.juegos.remove({})
    > db.jugadors.remove({})

Alternativamente, se puede eliminar toda la base de datos:

    > use gato
    > db.dropDatabase()

La base de datos y las colecciones se crean nuevamente de manera automática al momento de insertar datos.