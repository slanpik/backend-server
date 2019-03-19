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

    /** @var desde es el parametro de donde viene la peticion, en caso que sea nulo lo toma como 0 de manera automatica eso sirve para generar la paginación */
    var desde = req.query.desde || 0;
    desde = Number(desde);
    
    // Busco todos los medicos
    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        // esta funcion sirve para decirle a la petición que se salte los numeros 
        .skip(desde)
        // el limit limita los registros en este caso solo 5    
        .limit(5)
        .exec((err, medicos) => {
        
            // reviso si hubo algun error
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    mensajes: 'Error cargando los Medicos!!',
                    error: err
                });
            }

             // la funcion count me cuenta los numeros de registro que hay y me regresa un callback
             Medico.count({}, (err, conteo) => {
               
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los Medicos!!',
                        errors: err
                    });
                }
               
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo,
                });
            })

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
        medico.usuario =  req.usuario._id;

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