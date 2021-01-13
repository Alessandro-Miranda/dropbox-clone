var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(_req, res, _next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', (req, res) => {
  let form = new formidable.IncomingForm({
    uploadDir: "./upload", // indica o diretório para onde serão enviados os arquivos
    keepExtensions: true // Mantém a extensão dos arquivos
  });

  form.parse(req, (_err, _fields, files) => {
    res.json({
      files
    });
  });
  
});

module.exports = router;
