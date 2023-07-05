const sala = require('../model/sala');
const pessoa = require('../model/pessoa');
const pessoaReuniao = require('../model/pessoaReuniao');
const reuniao = require('../model/reuniao');

module.exports = {
    async salasGet(req, res){
        if(!req.session.usuario){
            res.redirect('/')
        }
        res.render('../views/salas');
    },
    

    async goSector(req, res){
        console.log(req.body)

            const setor = req.body.setor;

        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala'],
            where: {Setor: setor}
        });

        console.log(salas);

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome']
        });

        res.render('../views/salas', {salas, pessoas});
    }
}