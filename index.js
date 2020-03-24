const userController = require('./Controllers/UserController');
const path = require('path');
const Express = require('express')
const app = new Express()

const sequelize = require('./config/database');

app.get('/user', userController.list)
app.get('/user/:id', userController.show)

app.use(Express.static(__dirname + '/site'));

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname+'/site/accueil.html'));
});

app.get('/login',function(req,res) {
  res.sendFile(path.join(__dirname+'/site/login.html'));
});

app.get('/parcours',function(req,res) {
  res.sendFile(path.join(__dirname+'/site/parcours.html'));
});

app.get('/activites',function(req,res) {
  res.sendFile(path.join(__dirname+'/site/activites.html'));
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
