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

    /** @var desde es el parametro de donde viene la peticion, en caso que sea nulo lo toma como 0 de manera automatica eso sirve para generar la paginación */
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
            // La funcion populate sirve para obtener los datos de un campo especifico de la base de datos, en nuestro caso es el campo de usuario
            .populate('usuario', 'nombre email')
            // esta funcion sirve para decirle a la petición que se salte los numeros 
            .skip(desde)
            // el limit limita los registros en este caso solo 5    
            .limit(5)
            .exec( (err, hospitales ) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los hospitales!!',
                        errors: err
                    });
                }


                // la funcion count me cuenta los numeros de registro que hay y me regresa un callback
                Hospital.count({}, (err, conteo) => {
               
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando los hospitales!!',
                            errors: err
                        });
                    }
                
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo,
                    });
                })

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