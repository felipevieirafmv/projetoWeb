module.exports = {
    async reunioesGet(req, res){
        if(!req.session.usuario){
            res.redirect('/')
        }
        res.render('../views/reunioes');
    }
}