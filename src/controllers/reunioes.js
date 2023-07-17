const sala = require('../model/sala');
const pessoa = require('../model/pessoa');
const pessoaReuniao = require('../model/pessoaReuniao');
const reuniao = require('../model/reuniao');
const { Op } = require("sequelize");

module.exports = {
    async reunioesGet(req, res){
        if(!req.session.usuario){
            return res.redirect('/')
        }

        var hoje = new Date(Date.now());

        console.log(hoje);

        const reunioes = await pessoaReuniao.findAll({
            raw: true,
            attributes: ['Responsavel'],
            include: [
            {
                model: reuniao,
                attributes: ['Assunto', 'HorarioInicio', 'HorarioFim', 'IdReuniao', 'IDSala', 'Observacoes'],
                include: [{
                    model: sala,
                    attributes: ['Nome'],
                }],
                where: {
                    HorarioInicio:{[Op.gte]: hoje}
                }
            }
            ],
            where: {Usuario: req.session.usuario}
        });

        const dataComIntl = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });

        var datasI = []
        var datasF = []

        for(let i=0; i<reunioes.length; i++){
            datasI.push(dataComIntl.format(reunioes[i].HorarioInicio))
            datasF.push(dataComIntl.format(reunioes[i].HorarioFim))
        }

        console.log(datasI)
        console.log(datasF)

        res.render('../views/reunioes', {reunioes, datasI, datasF});
    }
}