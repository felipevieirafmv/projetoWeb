const sala = require('../model/sala');
const pessoa = require('../model/pessoa');
const pessoaReuniao = require('../model/pessoaReuniao');
const reuniao = require('../model/reuniao');

module.exports = {
    async reunioesGet(req, res){
        if(!req.session.usuario){
            res.redirect('/')
        }

        const reunioes = await pessoaReuniao.findAll({
            raw: true,
            attributes: ['Responsavel'],
            include: [
            {
                model: reuniao,
                attributes: ['Assunto', 'HorarioInicio', 'HorarioFim', 'IdReuniao', 'IDSala', 'Observacoes'],
                include: [{
                    model: sala,
                    attributes: ['Nome']
                }]
            }
            ],
            where: {
                Usuario: req.session.usuario
            }
        });

        console.log(reunioes)

        res.render('../views/reunioes', {reunioes});
    }
}