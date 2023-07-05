const sala = require('../model/sala');
const pessoa = require('../model/pessoa');
const pessoaReuniao = require('../model/pessoaReuniao');
const reuniao = require('../model/reuniao');

module.exports = {
    async mainGet(req, res){

        if(!req.session.usuario){
            res.redirect('/')
        }

        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
        });

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome']
        });

        res.render('../views/main', {salas, pessoas});
    }
}