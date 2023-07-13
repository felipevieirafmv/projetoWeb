const sala = require('../model/sala');
const pessoa = require('../model/pessoa');
const pessoaReuniao = require('../model/pessoaReuniao');
const reuniao = require('../model/reuniao');
const { Op } = require("sequelize");

module.exports = {
    async salasGet(req, res){
        if(!req.session.usuario){
            res.redirect('/')
        }
        res.render('../views/salas');
    },
    
    async goSector(req, res){
        const setor = req.body.setor;

        const salas = await sala.findAll({
            raw: true,
            attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala'],
            where: {Setor: setor}
        });

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome'],
                where: {Usuario: {[Op.ne]: req.session.usuario}}
        });

        res.render('../views/salas', {salas, pessoas});
    },

    // async horarioSala(req, res){
    //     const horario = req.body.horario;

    //     const salas = await sala.findAll({
    //         raw: true,
    //         attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala'],
    //         where: {Setor: setor}
    //     });

    //     const pessoas = await pessoa.findAll({
    //         raw: true,
    //         attributes: ['Usuario', 'Nome']
    //     });

    //     res.render('../views/salas', {salas, pessoas});
    // },

    async salasPost(req, res){
        const novaReuniao = req.body;
        const currentdate = new Date(); 
        const inicioNR = new Date(novaReuniao.dataInicio);
        const fimNR = new Date(novaReuniao.dataFim);
        var verificacao1 = true;

        if(novaReuniao.assunto == '' || novaReuniao.dataInicio == '' || novaReuniao.dataFim == '' || novaReuniao.select === undefined){
            console.log('reuniao inexistente');
            verificacao1 = false;
        }
        else{
            if(currentdate > inicioNR){
                console.log('reuniao no passado slk');
                verificacao1 = false;
            }
            else{
                if(fimNR < inicioNR){
                    console.log('acaba antes de terminar kk');
                    verificacao1 = false;
                }
                else{
                    if(fimNR.getTime()-inicioNR.getTime()>14400000){
                        console.log('compra uma sala logo pra vc');
                        verificacao1 = false;
                    }
                }
            }
        };

        if(verificacao1){
            const result = await pessoaReuniao.findAll({
                raw: true,
                include: [
                {
                    model: reuniao,
                    attributes: ['Assunto', 'HorarioInicio', 'HorarioFim', 'IdReuniao', 'IDSala', 'Observacoes'],
                    where: {
                        IDSala: novaReuniao.sala
                    }
                }
                ]
            });

            for(let i=0; i<result.length; i++){
                var inicioRA = new Date(result[i]['Reuniao.HorarioInicio']);
                var fimRA = new Date(result[i]['Reuniao.HorarioFim']);

                var compInicioNR = inicioNR.getTime();
                var compFimNR = fimNR.getTime();
                var compInicioRA = inicioRA.getTime();
                var compFimRA = fimRA.getTime();

                if(compInicioNR<=compInicioRA && compFimNR>compInicioRA){
                    console.log('sala invalida 1')
                    verificacao1 = false;
                }
                else if(compInicioRA<compInicioNR && compFimRA>compInicioNR){
                    console.log('sala invalida 2')
                    verificacao1 = false;
                }
                else if(compInicioNR<=compInicioRA && compFimNR>compFimRA){
                    console.log('sala invalida 3')
                    verificacao1 = false;
                }
                else if(compInicioRA<compInicioNR && compFimRA>compFimNR){
                    console.log('sala invalida 4')
                    verificacao1 = false;
                }
                
            }
        }

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

        const capSala = await sala.findOne({
            raw: true,
            attributes: ['IDSala', 'Nome', 'Capacidade'],
            where: {IDSala: novaReuniao.sala}
        });

        if(convidados.length>capSala.Capacidade){
            console.log('ta querendo gente dms amigao')
            verificacao1 = false;
        }

        if(verificacao1){

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
                        console.log('deu certo a verificacao kk')
                        ocupados.push(convidados[i]);
                    }
                    else if(compInicioRA<compInicioNR && compFimRA>compInicioNR){
                        console.log('deu certo dnv')
                        ocupados.push(convidados[i]);
                    }
                    else if(compInicioNR<compInicioRA && compFimNR>compFimRA){
                        console.log('deu certo mais uma')
                        ocupados.push(convidados[i]);
                    }
                    else if(compInicioRA<compInicioNR && compFimRA>compFimNR){
                        console.log('deu certo a ultima')
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
            console.log('reuniao nao existe meu parceiro')
        }
    }
}