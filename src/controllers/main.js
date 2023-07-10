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

        const reuniaos = await reuniao.findAll({
            raw: true,
            attributes: ['IDReuniao', 'Assunto', 'HorarioInicio', 'HorarioFim', 'Observacoes', 'IDSala']
        });

        const pessoas = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Nome']
        });

        res.render('../views/main', {salas, pessoas});
    },

    async mainPost(req, res){
        const novaReuniao = req.body;
        var currentdate = new Date(); 
        var dataComeco = new Date(novaReuniao.dataInicio);
        var dataTermino = new Date(novaReuniao.dataFim);
        // var datetime = currentdate.getFullYear() + "-"
        //         + (currentdate.getMonth()+1)  + "-" 
        //         + currentdate.getDate() + "T"  
        //         + currentdate.getHours() + ":"  
        //         + currentdate.getMinutes();

        // console.log(novaReuniao);

        // console.log(dataComeco)
        // console.log(dataComeco.getDate())
        // console.log(dataComeco.getMonth()+1)
        // console.log(dataComeco.getFullYear())
        // console.log(dataComeco.getHours())
        // console.log(dataComeco.getMinutes())

        // console.log(currentdate)
        // console.log(currentdate.getDate())
        // console.log(currentdate.getMonth()+1)
        // console.log(currentdate.getFullYear())
        // console.log(currentdate.getHours())
        // console.log(currentdate.getMinutes())

        // console.log(currentdate < dataComeco)

        console.log(novaReuniao)

        if(novaReuniao.assunto == '' || novaReuniao.dataInicio == '' || novaReuniao.dataFim == '' || novaReuniao.select === undefined){
            console.log('reuniao inexistente')
        }
        else{
            if(currentdate > dataComeco){
                console.log('reuniao no passado slk');
            }
            else{
                if(dataTermino < dataComeco){
                    console.log('acaba antes de terminar kk');
                }
                else{
                    if(dataTermino.getHours()-dataComeco.getHours>4){
                        console.log('compra uma sala logo pra vc');
                    }
                }
            }
        };

        const result = await pessoaReuniao.findAll({
            raw: true,
            attributes: ['Responsavel'],
            include: [
              {
                model: reuniao,
                attributes: ['Assunto', 'HorarioInicio', 'HorarioFim', 'IdReuniao', 'IDSala']
              }
            ],
            where: {
              Usuario: 'VIF1CT'
            }
          });

        // console.log(result);
    }
}


// inner join
// const reuniaopessoa = sawait treuniaopessoa ()
// include: [{
//     model: Reunião,
//     atributo: sla
// }]