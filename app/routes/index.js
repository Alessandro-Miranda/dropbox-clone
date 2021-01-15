var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next)
{
    res.render('index', { title: 'Express' });
});

router.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm({
        uploadDir: "./upload", // indica o diretório para onde serão enviados os arquivos
        keepExtensions: true // Mantém a extensão dos arquivos
    });

    form.parse(req, (err, fields, files) => {
        res.json({
            files
        });
    });

});

router.delete('/file', (req, resp) => {
    let form = new formidable.IncomingForm({
        uploadDir: "./upload", // indica o diretório para onde serão enviados os arquivos
        keepExtensions: true // Mantém a extensão dos arquivos
    });

    form.parse(req, (err, fields, files) => {

        let path = './' + fields.path;
        
        if(fs.existsSync(path))
        {
            fs.unlink(path, err => {
                if(err)
                {
                    resp.status(400).json({
                        err
                    });
                }
                else
                {
                    resp.json({
                        fields
                    });
                }
            });
        }
    });
})

module.exports = router;
