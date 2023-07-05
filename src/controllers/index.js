const pessoa = require('../model/pessoa');

module.exports = {
    async pagInicialGet(req, res){
        res.render('../views/index');
    },
    async pagInicialPost(req, res){
        const usuario = req.body.Login;
        const senha = req.body.Password;
        const dados = req.body;
        
        const p = await pessoa.findAll({
            raw: true,
            attributes: ['Usuario', 'Senha', 'Nome'],
            where: { Usuario: usuario }
        });

        session = req.session;

        if(!p){
            res.render('../views/index', {message: "Usuario ou senha incorretos"})
            return
        }
        if(p[0].Senha == senha){

            session.usuario = usuario;
            session.senha = senha;
            session.nome = p[0].Nome;

            res.redirect('/main')
        }
        else{
            res.render('../views/index', {message: "Usuario ou senha incorretos"})
        }
    },

    async logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}
