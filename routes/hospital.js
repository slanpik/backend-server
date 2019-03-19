// rutas de los hospitales
var express = require('express');

/** @var middlewareAuth es el middleware que se usa para la autenticacion del usuario  */
var middlewareAuth = require('../middlewares/auth');

/** @var app es el modulo de express */
var app = express();

/** @var Hospital es el modelo de hospitales. */
var Hospital = require('../models/hospital');

/**
 * ============================
 * Obtener todos los hospitales
 * ============================
 */
 app.get('/', (req, res, next) => {
    Hospital.find({}, 'nombre img usuario')
            .exec( (err, hospitales ) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los hospitales!!',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales
                });
            });
 });

 /**
  *========================
  * Crear un hospital
  *========================
  */
 app.post('/', middlewareAuth.verificaToken, (req, res) => {
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    // guardo los datos de un hospital
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
        
    });

    // guardar hospital en la base de datos
    hospital.save( (err, hospitalGuardado ) => {
        
        // Verificamos si hay un error al guardar
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al guardar el hospital",
                errors: err
            });
        }
        
        // si no hay error devuelvo un status 201
        return res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario
        });
    });
 });

 /**
  *========================
  * Actualizar un hospital
  *========================
  */
 app.put('/:id', middlewareAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        
        // si genera error devuelvo un error status 500
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital!!',
                errors: err
            });
        }

        if( !hospital ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar el hospital con el id' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID ' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario =  req.usuario._id;

        hospital.save( (err, hospitalGuardado) => {
            
            // si genera error devuelvo un error status 500
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital!',
                    errors: err
                });
            }

            // si no hay error devuelvo un status 201
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: req.usuario
            });

        });
    });
 });

 /**
  *========================
  * Borrar un hospital
  *========================
  */
app.delete('/:id', middlewareAuth.verificaToken, (req, res) => {
    
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
         
        // si genera error devuelvo un error status 500
         if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital!',
                errors: err
            });
        }

        // compruebo si existe el id que esta buscando
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: ' No se consiguio el hospital con el id' + id + 'por ende no se puede borrar',
                errors: { menssage: 'No existe un hospital con ese id' }
            });
        }

        // si no hay error devuelvo un status 201
        res.status(200).json({
            ok: true,
            mensaje: 'Hospital Borrado',
            hospitalBorrado: hospitalBorrado,
            usuarioToken: req.usuario
        });

    })
});
 
// con esto digo que se va a exportar el app para usar fuera del archivo
module.exports = app;