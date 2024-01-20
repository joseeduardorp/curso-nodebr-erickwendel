## Instalando e configurando imagem do Postgres

docker run \
 --name postgres \
 -e POSTGRES_USER=joseeduardo \
 -e POSTGRES_PASSWORD=senha \
 -e POSTGRES_DB=heroes \
 -p 5432:5432 \
 -d \
 postgres

docker ps

docker exec -ti postgres /bin/bash

### Instalando imagem do Adminer

docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer

## Instalando e configurando imagem do MongoDB

docker run \
 --name mongodb \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
 -d \
 mongo:4

## Instalando imagem do MongoClient

docker run \
 --name mongoclient \
 -p 3000:3000 \
 --link mongodb:mongodb \
 -d \
 mongoclient/mongoclient

docker exec -it mongodb \
 mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
 --eval "db.getSiblingDB('heroes').createUser({user: 'joseeduardo', pwd: 'minhasenha', roles: [{role: 'readWrite', db: 'heroes'}]})"
