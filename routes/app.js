// ruta principal del archivo

var express = require('express');
var app = express();


app.get('/', (request, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// con esto digo que se va a exportar el app para usar fuera del archivo
module.exports = app;