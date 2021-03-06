// Este arquivo de rota captura os dados para salvar os arquivos no disco local

var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next)
{
    res.render('index', { title: 'Express' });
});

router.get('/file', (req, res) => {
    let path = './' + req.query.path;

    if(fs.existsSync(path))
    {
        fs.readFile(path, (err, data) => {
            if(err)
            {
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }
            else
            {
                res.status(200).end(data);
            }
        })
    }
    else
    {
        res.status(404).json({
            error: 'File not found'
        });
    }
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
        else
        {
            resp.status(404).json({
                error: 'File not found'
            });
        }
    });
});

module.exports = router;
