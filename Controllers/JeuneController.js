
const db = require("../config/database");
const Jeune = db.import("../models/Jeune")
class JeuneController {
    static async list(req, res){
        let status = 200;
        let body = {};
       
        Jeune.findAll().then(jeunes => {
            return res.status(status).json(jeunes);
        }).catch(err => {
            status = 500;
            body = {'message': err};
            return res.status(status).json(body);
        });

    }
    static async show(req, res){
        let status = 200;
        let body = {};
        try {
            body = {
                'content': {
                    'id' : req.params.id,
                    'name' : 'Jean',
                    'lastName' : 'Dupont'
                }
            }
        } catch (error) {
            status = 500;
            body = {'message': error.message};
        }
        return res.status(status).json(body);
    }
}

module.exports = JeuneController