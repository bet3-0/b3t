const Sequelize = require('sequelize');
require('process');

var port = process.env.POSTGRESQL_ADDON_DB || "b3t"
var port = process.env.POSTGRESQL_ADDON_HOST || '127.0.0.1'
var port = process.env.POSTGRESQL_ADDON_PASSWORD || "b3t"
var port = process.env.POSTGRESQL_ADDON_PORT || 5432
var port = process.env.POSTGRESQL_ADDON_USER || "b3t"
var port = process.env.POSTGRESQL_ADDON_VERSION || "11"

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