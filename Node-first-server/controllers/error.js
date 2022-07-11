exports.get404 = (req, res, next) => {
    res.status(404).render('pageNotFound', {
        pageTitle: '404',
        path: '404',
    }); //sendFile(path.join(roodDir,"views","pageNotFound.html")); //Prima abbiamo indicato il codice da
    //inserire nell'header, e poi abbiamo
    //mandato la pagina di risposta.
    //La funzione di join ci permette tramite la path
    //di riuscire a ricostruire il percorso per reperire
    //qualsiasi file, su qualsiasi sistema operativo.
    //Send file serve appunto per restituire file.
};
