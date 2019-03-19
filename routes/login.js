// ruta para el login
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Se parametriza el seed para que sea mas facil de usar
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

// Metodo para logearse en la aplicación
app.post('/', (req, res) => {
    
    // inicializamos el body parser para obtener los datos
    var body = req.body;
    

    /**
     * Funcion para buscar un usuario por un parametro dado
     * @param email este es el parametro que se realizara la busqueda
     * @callback err es el error si no consigue el usuario
     * @callback usuarioDB es el usuario encontrado
     */
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
            usuarioDB.password = ':)';
            var token = jwt.sign({ usuario: usuarioDB}, SEED, { expiresIn: 14400 }); // vence en 4 horas

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB._id
            });

    });
    
});



// funcion para exportar
module.exports = app;