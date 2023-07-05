module.exports = {
    async mapaGet(req, res){
        if(!req.session.usuario){
            res.redirect('/')
        }
        res.render('../views/mapa');
    }
}