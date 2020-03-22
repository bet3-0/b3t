const userController = require('./Controllers/UserController');
const Express = require('express')
const app = new Express()

const sequelize = require('./config/database');

app.get('/user', userController.list)
app.get('/user/:id', userController.show)


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
