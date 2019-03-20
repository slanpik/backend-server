// imports
var express = require('express');
var app = express();

const path = require('path');

const fs = require('fs');

/**
 *========================
 * Mostrar una imagen especifica
 *========================
 */
app.get('/:tipo/:img', (req, res, next) => {

    /** @var tipo es la coleccion que recibimos del url */ 
    var tipo = req.params.tipo;
    /** @var img es el nombre de la imagen que recibimos en el url */ 
    var img = req.params.img;

    /** @var coleccionValidos tipos de coleccion validos */ 
    var coleccionValidos = ['hospitales', 'medicos', 'usuarios'];

    // si no es valido, envio un mensaje de error
    if(coleccionValidos.indexOf( tipo ) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Las colecciones validas son ' + coleccionValidos.join(', ') }
        });
    }

    /** @var pathImage este es el path de la imagen que vamos a mostrar */
    var pathImage = path.resolve( __dirname, `../uploads/${ tipo }/${ img }` );

    // Si la imagen existe, envio la imagen
    if( fs.existsSync( pathImage ) ) {
        res.sendFile( pathImage ); 
    } 
    // si no existe la imagen, envio un no image
    else {
        /** @var pathNoImage este es el path de la imagen que mostramos cuando no hay imagen */
        var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg');
        res.sendFile( pathNoImage );
    }

});

// con esto digo que se va a exportar el app para usar fuera del archivo
module.exports = app;