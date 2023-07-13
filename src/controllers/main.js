const sala = require('../model/sala');
const pessoa = require('../model/pessoa');
const pessoaReuniao = require('../model/pessoaReuniao');
const reuniao = require('../model/reuniao');
const { Op } = require("sequelize");

module.exports = {
    async mainGet(req, res){

        if(!req.session.usuario){
            res.redirect('/')
        }

        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
        });

        const reuniaos = await reuniao.findAll({
            raw: true,
            attributes: ['IDReuniao', 'Assunto', 'HorarioInicio', 'HorarioFim', 'Observacoes', 'IDSala']
        });

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome'],
                where: {Usuario: {[Op.ne]: req.session.usuario}}
        });

        res.render('../views/main', {salas, pessoas, message: false});
    },
    async pagInicialGet(req, res){
        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome'],
                where: {Usuario: {[Op.ne]: req.session.usuario}}
        });
        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
        });
        res.render('../views/main', {salas, pessoas, message: false});
    },
    async mainPost(req, res){
        const novaReuniao = req.body;
        const currentdate = new Date(); 
        const inicioNR = new Date(novaReuniao.dataInicio);
        const fimNR = new Date(novaReuniao.dataFim);
        var verificacao1 = true;


        // função vini

        if(novaReuniao.assunto == '' || novaReuniao.dataInicio == '' || novaReuniao.dataFim == '' || novaReuniao.select === undefined){
            const pessoas = await pessoa.findAll({
                raw: true,
                attributes: ['Usuario', 'Nome'],
                    where: {Usuario: {[Op.ne]: req.session.usuario}}
            });
            const salas = await sala.findAll({
                raw: true,
                attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
            });
            verificacao1 = false;
            const mensagem = 'Sua reunião não existe.';
            res.render('../views/main', {salas, pessoas, message: true, mensagem});
        }
        else{
            if(currentdate > inicioNR){
                const pessoas = await pessoa.findAll({
                    raw: true,
                    attributes: ['Usuario', 'Nome'],
                        where: {Usuario: {[Op.ne]: req.session.usuario}}
                });
                const salas = await sala.findAll({
                    raw: true,
                    attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
                });
                verificacao1 = false;
                const mensagem = 'Data inválida: Horário anterior ao atual.';
                res.render('../views/main', {salas, pessoas, message: true, mensagem});
            }
            else{
                if(fimNR < inicioNR){
                    const pessoas = await pessoa.findAll({
                        raw: true,
                        attributes: ['Usuario', 'Nome'],
                            where: {Usuario: {[Op.ne]: req.session.usuario}}
                    });
                    const salas = await sala.findAll({
                        raw: true,
                        attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
                    });
                    verificacao1 = false;
                    const mensagem = 'Data inválida: Termina antes de começar.';
                    res.render('../views/main', {salas, pessoas, message: true, mensagem});
                }
                else{
                    if(fimNR.getTime()-inicioNR.getTime()>14400000){
                        const pessoas = await pessoa.findAll({
                            raw: true,
                            attributes: ['Usuario', 'Nome'],
                                where: {Usuario: {[Op.ne]: req.session.usuario}}
                        });
                        const salas = await sala.findAll({
                            raw: true,
                            attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
                        });
                        verificacao1 = false;
                        const mensagem = 'Excede o limete de tempo (4 horas).';
                        res.render('../views/main', {salas, pessoas, message: true, mensagem});
                    }
                }
            }
        };

        if(verificacao1){

            let convidados = [];
            convidados.push(req.session.usuario.toUpperCase());

            console.log(novaReuniao.select)

            if(typeof novaReuniao.select === 'string'){
                convidados.push(novaReuniao.select)
            }
            else{
                for(let i=0; i<novaReuniao.select.length; i++){
                    convidados.push(novaReuniao.select[i]);
                }
            }

            var ocupados = []

            for(let i=0; i<convidados.length; i++){

                const result = await pessoaReuniao.findAll({
                    raw: true,
                    attributes: ['Responsavel'],
                    include: [
                    {
                        model: reuniao,
                        attributes: ['Assunto', 'HorarioInicio', 'HorarioFim', 'IdReuniao', 'IDSala', 'Observacoes']
                    }
                    ],
                    where: {
                        Usuario: convidados[i]
                    }
                });

                for(let j=0; j<result.length; j++){
                    var inicioRA = new Date(result[j]['Reuniao.HorarioInicio']);
                    var fimRA = new Date(result[j]['Reuniao.HorarioFim']);

                    var compInicioNR = inicioNR.getTime();
                    var compFimNR = fimNR.getTime();
                    var compInicioRA = inicioRA.getTime();
                    var compFimRA = fimRA.getTime();

                    if(compInicioNR<compInicioRA && compFimNR>compInicioRA){
                        ocupados.push(convidados[i]);
                    }
                    else if(compInicioRA<compInicioNR && compFimRA>compInicioNR){
                        ocupados.push(convidados[i]);
                    }
                    else if(compInicioNR<compInicioRA && compFimNR>compFimRA){
                        ocupados.push(convidados[i]);
                    }
                    else if(compInicioRA<compInicioNR && compFimRA>compFimNR){
                        ocupados.push(convidados[i]);
                    }
                }

            }
            console.log(ocupados);
            console.log(fimNR.getTime());
            
            if(ocupados.length<1){
                const r = await reuniao.create({
                    Assunto: novaReuniao.assunto,
                    HorarioInicio: inicioNR,
                    HorarioFim: fimNR,
                    IDSala: novaReuniao.sala,
                    Observacoes: novaReuniao.comentario
                })

                for(let i=0; i<convidados.length; i++){

                    var resp = true;

                    if(i!=0){
                        resp = false;
                    }

                    await pessoaReuniao.create({
                        Responsavel: resp,
                        Usuario: convidados[i],
                        IdReuniao: r.IdReuniao
                    })
                }
            }
        }
        else{
            const pessoas = await pessoa.findAll({
                raw: true,
                attributes: ['Usuario', 'Nome'],
                    where: {Usuario: {[Op.ne]: req.session.usuario}}
            });
            const salas = await sala.findAll({
                raw: true,
                attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala']
            });
            const mensagem = 'Sua reunião não existe.';
            res.render('../views/main', {salas, pessoas, message: true, mensagem});
            
            // função vini para convidados
            
        }
    }
}


// inner join
// const reuniaopessoa = sawait treuniaopessoa ()
// include: [{
//     model: Reunião,
//     atributo: sla
// }]