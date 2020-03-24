const Sequelize = require('sequelize');

const db = new Sequelize('b3t', 'b3t', 'b3t', {
    host: '127.0.0.1',
    dialect: 'postgres'
});

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

db.sync()
    .then()
    .catch((err) => {
        console.log(err)
    });

module.exports = db