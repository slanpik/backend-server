// ruta para el login
var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();
var Usuario = require('../models/usuario');

// Metodo para logearse en la aplicación
app.post('/', (req, res) => {
    
    // inicializamos el body parser para obtener los datos
    var body = req.body;
    

    Usuario.findOne({ email: body.email }, ( err, usuarioDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        } 

            // Crear un token

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                id: usuarioDB._id
            });

    });
    
});



// funcion para exportar
module.exports = app;