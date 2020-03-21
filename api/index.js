const express = require('express')
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize('b3t', 'b3t', 'b3t', {
    host: '127.0.0.1',
    dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class User extends Model {}
User.init({
    // attributes
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING
      // allowNull defaults to true
    }
  }, {
    sequelize,
    modelName: 'user'
    // options
  });

sequelize.sync()
.then()
.catch((err) => {
  
});

const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
