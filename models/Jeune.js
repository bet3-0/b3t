const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require("../config/database");

class Jeune extends Model {}
Jeune.init({
  hashAdherent: { type: Sequelize.STRING },
  activites: { type: Sequelize.STRING },
}, {
    sequelize
})