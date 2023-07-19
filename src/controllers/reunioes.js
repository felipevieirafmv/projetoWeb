const sala = require('../model/sala');
const pessoa = require('../model/pessoa');
const pessoaReuniao = require('../model/pessoaReuniao');
const reuniao = require('../model/reuniao');
const { Op } = require("sequelize");
const moment = require('moment');


module.exports = {
    async reunioesGet(req, res){
        if(!req.session.usuario){
            return res.redirect('/')
        }

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome'],
                where: {Usuario: {[Op.ne]: req.session.usuario}}
        });

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
                }]
            }],
            where: {Usuario: req.session.usuario},
            order: [
                [reuniao, 'HorarioInicio', 'ASC']
            ]
        });

        const dataComIntl = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });

        var reunioesFront = []


        for(let i=0; i<reunioes.length; i++){
            if(reunioes[i]['Reuniao.HorarioInicio'] >= hoje){
                reunioesFront.push(reunioes[i])
            }
        }

        var datasI = []
        var datasF = []
        var nomes = []

        for(let i=0; i<reunioesFront.length; i++){
            datasI.push(dataComIntl.format(reunioesFront[i]['Reuniao.HorarioInicio']))
            datasF.push(dataComIntl.format(reunioesFront[i]['Reuniao.HorarioFim']))
            nomes.push(reunioesFront[i]['Reuniao.Sala.Nome'])
        }


        var colunas = 3

        if(reunioesFront.length<3){
            colunas = 2
        }

        res.render('../views/reunioes', {reunioesFront, datasI, datasF, colunas, pessoas, nomes, message: false});
    },
































    async excluirReuniao(req, res){
        if(!req.session.usuario){
            return res.redirect('/')
        }

        const id = req.body.IdReuniao

        console.log(id)

        
        await reuniao.destroy({
            where: {IdReuniao: id}
        })

        await pessoaReuniao.destroy({
            where: {IdReuniao: id}
        })

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome'],
                where: {Usuario: {[Op.ne]: req.session.usuario}}
        });

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
                }]
            }],
            where: {Usuario: req.session.usuario},
            order: [
                [reuniao, 'HorarioInicio', 'ASC']
            ]
        });

        const dataComIntl = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });

        var reunioesFront = []

        for(let i=0; i<reunioes.length; i++){
            if(reunioes[i]['Reuniao.HorarioInicio'] >= hoje){
                reunioesFront.push(reunioes[i])
            }
        }

        var datasI = []
        var datasF = []
        var nomes = []

        for(let i=0; i<reunioesFront.length; i++){
            datasI.push(dataComIntl.format(reunioesFront[i]['Reuniao.HorarioInicio']))
            datasF.push(dataComIntl.format(reunioesFront[i]['Reuniao.HorarioFim']))
            nomes.push(reunioesFront[i]['Reuniao.Sala.Nome'])
        }

        var colunas = 3

        if(reunioesFront.length<3){
            colunas = 2
        }

        const message = {message:'Reunião excluída com sucesso.', variante:'success'};
        res.render('../views/reunioes', {reunioesFront, datasI, datasF, colunas, pessoas, nomes, message});
    },































    async atualizarReuniao(req, res){

        const id = req.body.IdReuniao

        const RAntiga = await reuniao.findAll({
            raw: true,
            where: {IdReuniao:id}
        })

        const PRAntiga = await pessoaReuniao.findAll({
            raw: true,
            where: {IdReuniao:id}
        })

        await reuniao.destroy({
            where: {IdReuniao: id}
        })

        await pessoaReuniao.destroy({
            where: {IdReuniao: id}
        })
        
        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome'],
                where: {Usuario: {[Op.ne]: req.session.usuario}}
        });

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
                }]
            }],
            where: {Usuario: req.session.usuario},
            order: [
                [reuniao, 'HorarioInicio', 'ASC']
            ]
        });

        const dataComIntl = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });

        var reunioesFront = []

        var hoje = new Date(Date.now());

        for(let i=0; i<reunioes.length; i++){
            if(reunioes[i]['Reuniao.HorarioInicio'] >= hoje){
                reunioesFront.push(reunioes[i])
            }
        }

        var datasI = []
        var datasF = []
        var nomes = []

        for(let i=0; i<reunioesFront.length; i++){
            datasI.push(dataComIntl.format(reunioesFront[i]['Reuniao.HorarioInicio']))
            datasF.push(dataComIntl.format(reunioesFront[i]['Reuniao.HorarioFim']))
            nomes.push(reunioesFront[i]['Reuniao.Sala.Nome'])
        }

        var colunas = 3

        if(reunioesFront.length<3){
            colunas = 2
        }

        const novaReuniao = req.body;
        const currentdate = new Date(); 
        const inicioNR = new Date(novaReuniao.dataInicio);
        const fimNR = new Date(novaReuniao.dataFim);
        var verificacao1 = true;
        var verificacao2 = false;

        if(novaReuniao.assunto == '' || novaReuniao.dataInicio == '' || novaReuniao.dataFim == '' || novaReuniao.select === undefined){
            verificacao1 = false;
        }
        else{
            if(currentdate > inicioNR){
                verificacao1 = false;
            }
            else{
                if(fimNR < inicioNR){
                    verificacao1 = false;
                }
                else{
                    if(fimNR.getTime()-inicioNR.getTime()>14400000){
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

            console.log(result['Reuniao.IDSala'])

            if(result['Reuniao.IDSala']>2){
                for(let i=0; i<result.length; i++){
                    var inicioRA = new Date(result[i]['Reuniao.HorarioInicio']);
                    var fimRA = new Date(result[i]['Reuniao.HorarioFim']);

                    var compInicioNR = inicioNR.getTime();
                    var compFimNR = fimNR.getTime();
                    var compInicioRA = inicioRA.getTime();
                    var compFimRA = fimRA.getTime();

                    if(compInicioNR<=compInicioRA && compFimNR>compInicioRA){
                        verificacao1 = false;
                    }
                    else if(compInicioRA<compInicioNR && compFimRA>compInicioNR){
                        verificacao1 = false;
                    }
                    else if(compInicioNR<=compInicioRA && compFimNR>compFimRA){
                        verificacao1 = false;
                    }
                    else if(compInicioRA<compInicioNR && compFimRA>compFimNR){
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
                            verificacao2 = true;
                        }
                        else if(compInicioRA<compInicioNR && compFimRA>compInicioNR){
                            console.log('deu certo dnv')
                            ocupados.push(convidados[i]);
                            verificacao2 = true;
                        }
                        else if(compInicioNR<compInicioRA && compFimNR>compFimRA){
                            console.log('deu certo mais uma')
                            ocupados.push(convidados[i]);
                            verificacao2 = true;
                        }
                        else if(compInicioRA<compInicioNR && compFimRA>compFimNR){
                            console.log('deu certo a ultima')
                            ocupados.push(convidados[i]);
                            verificacao2 = true;
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
                    const message = {message:'Reunião atualizada com sucesso.', variante:'success'};
                    res.render('../views/reunioes', {reunioesFront, datasI, datasF, colunas, pessoas, nomes, message});
                }
            }
        }
        else{

            const almoco = await reuniao.create({
                Assunto: RAntiga[0].Assunto,
                HorarioInicio: RAntiga[0].HorarioInicio,
                HorarioFim: RAntiga[0].HorarioFim,
                IDSala: RAntiga[0].IDSala,
                Observacoes: RAntiga[0].Observacoes
            })

            for(let i=0; i<PRAntiga.length; i++){

                await pessoaReuniao.create({
                    Responsavel: PRAntiga[i].Responsavel,
                    Usuario: PRAntiga[i].Usuario,
                    IdReuniao: almoco.IdReuniao
                })
            }

            const message = {message:'Não foi possível atualizar a reunião.', variante:'danger'};
            res.render('../views/reunioes', {reunioesFront, datasI, datasF, colunas, pessoas, nomes, message});
        }

        if(verificacao2){

            const almoco = await reuniao.create({
                Assunto: RAntiga[0].Assunto,
                HorarioInicio: RAntiga[0].HorarioInicio,
                HorarioFim: RAntiga[0].HorarioFim,
                IDSala: RAntiga[0].IDSala,
                Observacoes: RAntiga[0].Observacoes
            })

            for(let i=0; i<PRAntiga.length; i++){

                console.log(PRAntiga[i].Usuario)

                await pessoaReuniao.create({
                    Responsavel: PRAntiga[i].Responsavel,
                    Usuario: PRAntiga[i].Usuario,
                    IdReuniao: almoco.IdReuniao
                })
            }
            
            const message = {message:'Não foi possível atualizar a reunião.', variante:'danger'};
            res.render('../views/reunioes', {reunioesFront, datasI, datasF, colunas, pessoas, nomes, message});
        }

    }
}