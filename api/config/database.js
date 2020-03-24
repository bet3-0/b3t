const Sequelize = require('sequelize');

console.log(process.env.POSTGRESQL_ADDON_DB)
var dbname = process.env.POSTGRESQL_ADDON_DB
var host = process.env.POSTGRESQL_ADDON_HOST
var password = process.env.POSTGRESQL_ADDON_PASSWORD
var port = process.env.POSTGRESQL_ADDON_PORT 
var user = process.env.POSTGRESQL_ADDON_USER 
var version = process.env.POSTGRESQL_ADDON_VERSION

const db = new Sequelize(dbname, user, password, {
    host: host,
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