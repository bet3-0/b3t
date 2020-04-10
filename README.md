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
Add correct CELLAR config, ask Lead devs for credentials
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
