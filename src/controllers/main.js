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

        // var tempPessoas = [];

        // for(let i=0; i<pessoas.length; i++){
        //     if(pessoas[i].Usuario != req.session.usuario){
        //         tempPessoas.push(pessoas[i])
        //     }
        // }

        // console.log(tempPessoas)
        console.log(pessoas)

        res.render('../views/main', {salas, pessoas});
    },

    async mainPost(req, res){
        // process.env.TZ = "America/Sao_Paulo";
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
                    if(fimNR.getHours()-inicioNR.getHours>4){
                        console.log('compra uma sala logo pra vc');
                        verificacao1 = false;
                    }
                }
            }
        };

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

                if(compInicioNR<0){
                    compInicioNR+=24;
                }

                if(compFimNR<0){
                    compFimNR+=24;
                }

                console.log('compInicioNR: ', compInicioNR);
                console.log('compFimNR: ', compFimNR);
                console.log('compInicioRA: ', compInicioRA);
                console.log('compFimRA: ', compFimRA);

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


            // console.log(novaReuniao);
            // console.log(inicioNR);
            // console.log(fimNR);

            
            console.log(result[i]);
        }
        console.log(ocupados);
        
        if(ocupados.length<1 || verificacao1){
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
}


// inner join
// const reuniaopessoa = sawait treuniaopessoa ()
// include: [{
//     model: Reunião,
//     atributo: sla
// }]