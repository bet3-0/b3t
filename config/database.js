const Sequelize = require('sequelize');

var dbname = process.env.POSTGRESQL_ADDON_DB || "b3t"
var host = process.env.POSTGRESQL_ADDON_HOST || '127.0.0.1'
var password = process.env.POSTGRESQL_ADDON_PASSWORD || "b3t"
var port = process.env.POSTGRESQL_ADDON_PORT || 5432
var user = process.env.POSTGRESQL_ADDON_USER || "b3t"
var version = process.env.POSTGRESQL_ADDON_VERSION || "11"

console.log(dbname)

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

const Jeune = db.import("../models/Jeune")

db.sync()
    .then()
    .catch((err) => {
        console.log(err)
    });

module.exports = db