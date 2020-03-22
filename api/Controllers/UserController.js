class UserController {
    static async list(req, res){
        let status = 200;
        let body = {};
        try {
            body = {
                'content': [
                    {
                        'name' : 'victor',
                        'lastName' : 'fau'
                    },
                    {
                        'name' : 'Jean',
                        'lastName' : 'Dupont'
                    }
                ]
            }
        } catch (error) {
            status = 500;
            body = {'message': error.message};
        }
        return res.status(status).json(body);
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

module.exports = UserController