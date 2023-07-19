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

        res.render('../views/salas', {salas, pessoas, setor, message: false});
    },

    async horarioSala(req, res){
        const horario = req.body.dataReuniao;
        const setor = req.body.setor;

        var reunioes = await reuniao.findAll({
            raw: true,
            attributes: ['Assunto', 'HorarioInicio', 'HorarioFim', 'IdReuniao', 'IDSala', 'Observacoes'],
            include: [
                {
                    model: sala,
                    attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala'],
                }
            ],
            where: {
                [Op.and]: [
                    {HorarioInicio:{[Op.lte]: horario}}, {HorarioFim:{[Op.gte]: horario}}
                ]
            }
        });

        // where: {
        //     [Op.and]: [
        //         {[Op.gte]: horario}, {[Op.lte]: horario}
        //     ]
        // }

        // console.log(horario)

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome']
        });

        console.log(reunioes)

        if(reunioes.length<1){
            const salas = await sala.findAll({
                raw: true,
                attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala'],
                where:{Setor: setor}
            });
            return res.render('../views/salas', {salas, pessoas, setor, message: false});
        }
        else{
            const ids = []

            for(let i=0; i<reunioes.length; i++){
                ids.push(reunioes[i].IDSala);
            }

            const salas = await sala.findAll({
                raw: true,
                attributes: ['IDSala', 'Nome', 'Capacidade', 'Setor', 'FotoSala'],
                where:{
                    [Op.and]: [
                        {Setor: setor}, {IDSala: {[Op.notIn]: ids}}
                    ]
                }
            });

            console.log(ids)
            
            return res.render('../views/salas', {salas, pessoas, setor, message: false});
        }
    },







































    async salasPost(req, res){
        const novaReuniao = req.body;
        const setor = novaReuniao.setor[0];
        const currentdate = new Date(); 
        const inicioNR = new Date(novaReuniao.dataInicio);
        const fimNR = new Date(novaReuniao.dataFim);
        var verificacao1 = true;



        console.log(novaReuniao)
        console.log(setor)

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


        

        if(novaReuniao.assunto == '' || novaReuniao.dataInicio == '' || novaReuniao.dataFim == '' || novaReuniao.select === undefined){
            verificacao1 = false;
            const message = {message:'Incompleta: Faltaram dados para serem preenchidos.', variante:'danger'};
            console.log('entrou')
            res.render('../views/salas.ejs', {salas, pessoas, message, setor});
        }
        else{
            if(currentdate > inicioNR){
                verificacao1 = false;
                const message = {message:'Data: Não é possível criar uma reunião antes da data atual.', variante:'danger'};
                res.render('../views/salas.ejs', {salas, pessoas, message, setor});
            }
            else{
                if(fimNR < inicioNR){
                    verificacao1 = false;
                    const message = {message:'Horário: O horário final da reunião deve ser após o horário inicial.', variante:'danger'};
                    res.render('../views/salas.ejs', {salas, pessoas, message, setor});
                }
                else{
                    if(fimNR.getTime()-inicioNR.getTime()>14400000){
                        verificacao1 = false;
                        const message = {message:'Horário: A reunião excede o limite de tempo (4 horas).', variante:'danger'};
                        res.render('../views/salas.ejs', {salas, pessoas, message, setor});
                    }
                }
            }
        };

        console.log(verificacao1)
        console.log(novaReuniao.select)

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
                    verificacao1 = false;
                    const message = {message:'Sala indisponível para esse horário.', variante:'danger'};
                    res.render('../views/salas.ejs', {salas, pessoas, message, setor});
                }
                else if(compInicioRA<compInicioNR && compFimRA>compInicioNR){
                    verificacao1 = false;
                    const message = {message:'Sala indisponível para esse horário.', variante:'danger'};
                    res.render('../views/salas.ejs', {salas, pessoas, message, setor});
                }
                else if(compInicioNR<=compInicioRA && compFimNR>compFimRA){
                    verificacao1 = false;
                    const message = {message:'Sala indisponível para esse horário.', variante:'danger'};
                    res.render('../views/salas.ejs', {salas, pessoas, message, setor});
                }
                else if(compInicioRA<compInicioNR && compFimRA>compFimNR){
                    verificacao1 = false;
                    const message = {message:'Sala indisponível para esse horário.', variante:'danger'};
                    res.render('../views/salas.ejs', {salas, pessoas, message, setor});
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
                const message = {message:'Reunião marcada com sucesso.', variante:'success'};
                res.render('../views/salas.ejs', {salas, pessoas, message, setor});
            }
            else{
                const message = {message:'Horário solicitado não está disponível para algum convidado.', variante:'danger'};
                res.render('../views/salas.ejs', {salas, pessoas, message, setor});
            }
        }
        }

        else{
            const message = {message:'Horário solicitado não está disponível para algum convidado.', variante:'danger'};
            res.render('../views/salas.ejs', {salas, pessoas, message, setor});
        }
    }
}