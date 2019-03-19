// rutas de los medicos
var express = require('express');

/** @var middlewareAuth es el middleware que se usa para la autenticacion del usuario  */
var middlewareAuth = require('../middlewares/auth');

/** @var app es el modulo de express */
var app = express();

/** @var Medico es el modelo de medicos */
var Medico = require('../models/medico');

/**
 *========================
 * Obtener todos los medicos
 *========================
 */
app.get('/', (req, res, next) => {
    
    // Busco todos los medicos
    Medico.find({}).exec((err, medicos) => {
        
        // reviso si hubo algun error
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensajes: 'Error cargando los Medicos!!',
                error: err
            });
        }

        // si no hay error 
        res.status(200).json({
            ok: true,
            medicos: medicos
        });

    });

});


/**
 *========================
 * Crear un medico
 *========================
 */
app.post('/', middlewareAuth.verificaToken, (req, res) => {

    // obtengo los datos con el body parser
    var body = req.body;

    // Seteo el dato para guardarlo
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body._idHospital
    });
    

    // guardo el medico
    medico.save( (err, medicoGuardado ) => {

        // reviso si hubo algun error al guardar
        if( err ) {
            return res.status(400).json({
                ok: false,
                mensajes: 'Error al cargar el Medico!!',
                error: err
            });
        }

        // retorno la petición con un estado 200
        res.status(200).json({
            ok:true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });

    });

});

/**
 *========================
 * Actualizar un medico
 *========================
 */
app.put('/:id', middlewareAuth.verificaToken, (req, res) => {

    /** @var id es el id del medico para actualizar */
    var id = req.params.id;

    /** @var body son los datos que se van a actualizar */
    var body = req.body;

    // conseguimos el medico
    Medico.findById(id, (err, medico) => {
        
        // validamos que no halla error
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        // validamos que el medico exista
        if ( !medico ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar el medico con la id ' + id ,
                errors: { message: 'No existe un usuario con ese ID ' }
            });
        }


        medico.nombre = body.nombre;

        // Verifico si viene el id del hospital
        if ( body._idHospital != null ) {
            
            medico.hospital = body._idHospital;
            
        }         
        
        // salvo los cambios del medico
        medico.save( (err, medicoGuardado) => {
            // reviso si hubo algun error al guardar
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    mensajes: 'Error al cargar el Medico!!',
                    error: err
                });
            }

            // retorno la petición con un estado 200
            res.status(200).json({
                ok:true,
                medico: medicoGuardado,
                usuarioToken: req.usuario
            });
        });
    });
});


app.delete('/:id', middlewareAuth.verificaToken, (req, res) => {
    
    /** @var id es el id del medico para actualizar */
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        
        // validamos que no halla error
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un medico!',
                errors: err
            });
        }

        if( !medicoBorrado ) {
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe un medico con ese id' + id,
                errors: { menssage: 'No existe un medico con ese id' }
            })

        }
        
        // si no hay error devuelvo un status 201
        res.status(200).json({
            ok: true,
            mensaje: 'Medico Borrado',
            medicoBorrado: medicoBorrado,
            usuarioToken: req.usuario
        });
    });
});


// con esto digo que se va a exportar el app para usar fuera del archivo
module.exports = app;