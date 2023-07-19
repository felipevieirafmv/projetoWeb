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

    async mainPost(req, res){
        const novaReuniao = req.body;
        const currentdate = new Date(); 
        const inicioNR = new Date(novaReuniao.dataInicio);
        const fimNR = new Date(novaReuniao.dataFim);
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
        var verificacao1 = true;

        if(novaReuniao.assunto == '' || novaReuniao.dataInicio == '' || novaReuniao.dataFim == '' || novaReuniao.select === undefined){
            verificacao1 = false;
            const message = 'Incompleta: Faltaram dados para serem preenchidos.';
            res.render('../views/main', {salas, pessoas, message});
        }
        else{
            if(currentdate > inicioNR){
                verificacao1 = false;
                const message = 'Data: Não é possível criar uma reunião antes da data atual.';
                res.render('../views/main', {salas, pessoas, message});
            }
            else{
                if(fimNR < inicioNR){
                    verificacao1 = false;
                    const message = 'Horário: O horário final da reunião deve ser após o horário inicial.';
                    res.render('../views/main', {salas, pessoas, message});
                }
                else{
                    if(fimNR.getTime()-inicioNR.getTime()>14400000){
                        verificacao1 = false;
                        const message = 'Horário: A reunião excede o limite de tempo (4 horas).';
                        res.render('../views/main', {salas, pessoas, message});
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
            const message = 'Reunião inexistente.';
            res.render('../views/main', {salas, pessoas, message});
        }
    }
}


// inner join
// const reuniaopessoa = sawait treuniaopessoa ()
// include: [{
//     model: Reunião,
//     atributo: sla
// }]