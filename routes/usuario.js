// rutas de los usuarios
var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');

/**
 * ==========================
 * Obtener todos los usuarios
 * ==========================
 */
app.get('/', (request, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios!',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });    
});

/**
 * ==========================
 * Crear un nuevo usuario
 * ==========================
 */
app.post('/', (req, res) => {
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    // guardo los datos de un usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    // guardamos el usuario
    usuario.save( ( err, usuarioGuardado) => {
        // si genera error devuelvo un error status 500
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario!',
                errors: err
            });
        }
        
        // si no hay error devuelvo un status 201
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
        
    });
});

/**
 * =====================
 * Actualizar usuario
 * =====================
 */
app.put('/:id', (req, res) => {
    
    var id = req.params.id;
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    Usuario.findById( id, (err, usuario) => {
        // si genera error devuelvo un error status 500
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario con el id' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID ' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {

            // si genera error devuelvo un error status 500
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario!',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            // si no hay error devuelvo un status 201
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });

});


/**
 * =====================
 * Eliminar un usuario por id
 * =====================
 */
app.delete('/:id', (req, ress) => {
    
    var id = req.params.id;

    Usuario.findOneAndDelete(id, ( err, usuarioBorrado) => {
         // si genera error devuelvo un error status 500
         if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario!',
                errors: err
            });
        }


        if( !usuarioBorrado ) {
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe un usuario con ese id',
                errors: { menssage: 'No existe un usuario con ese id' }
            })

        }
        
        // si no hay error devuelvo un status 201
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario Borrado',
        });
    });

});


// con esto digo que se va a exportar el app para usar fuera del archivo
module.exports = app;