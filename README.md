# b3t



Start API

Requirements
- golang 1.14
- docker 
- docker-compose

Run
```
cp env.sh.sample env.sh
```
Ask Lead devs for cellar credentials and add it to env.sh
```
source env.sh
docker-compose up -d
go run *.go
```

# Lancer le front

Requirements
- node & npm

commands : 
```
cd front
npm install
npm run serve
```

# Build to release 

```
npx vue-cli-service build
```
