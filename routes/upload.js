// importaciones
var express = require('express');
var fileUpload = require('express-fileupload');
// esta importación sirve para manejar archivos (en nuestro caso borrar)
var fs = require('fs');

// importar modelos
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');

var app = express();

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    /** @var tipo es la coleccion que recibimos del url */ 
    var tipo = req.params.tipo;

    /** @var id es el id del usuario que se va a actualizar */
    var id = req.params.id;

     /** @var coleccionValidos tipos de coleccion validos */ 
    var coleccionValidos = ['hospitales', 'medicos', 'usuarios'];

    if(coleccionValidos.indexOf( tipo ) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Las colecciones validas son ' + coleccionValidos.join(', ') }
        });
    }

    if( ! req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    /** @var archivo Obtener nombre del archivo */
    var archivo = req.files.imagen;
    /** @var nombreCortado hacemos un split para separar el nombre en un array */
    var nombreCortado = archivo.name.split('.');
    /** @var extensionArchivo obtengo la extension del archivo */
    var extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];


    /** @var extensionesValidas Solo estas extensiones aceptamos */
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // si no hay una extension valida, envio un error
    if( extensionesValidas.indexOf( extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

   /** @var nombreArchivo Nombre del archivo con su extension */
   var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

   /** @var path es el path del archivo donde se va a mover */
   var path = `./uploads/${ tipo }/${ nombreArchivo }`;

   // movemos el archivo
   archivo.mv( path, err => {
    // Pregunto si hay un error al mover el archivo
    if(err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al mover archivo',
            errors: err
        });
    }    

    // llamamos a la funcion
    subirPorColleccion( tipo, id, nombreArchivo, res );

   })
});

/**
 * Funcion para subir una imagen a una coleccion especifica
 * @param {*} tipo es el nombre la coleccion donde se va a guardar
 * @param {*} id es el id del usuario que se va a actualizar
 * @param {*} nombreArchivo es el nombre del archivo que se va actualizar
 * @param {*} res es la respuesta que se va a enviar al servidor
 */
function subirPorColleccion( tipo, id, nombreArchivo, res ) {

    switch( tipo ) {
        
        case 'usuarios':
            Usuario.findById( id , (err, usuario) => {

                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Ocurrio un error al obtener el usuario',
                        errors: err
                    });
                }

                if( !usuario ) {
                    return res.status(401).json({
                        ok:false,
                        mensaje: 'No existe el usuario con ese id' + id,
                        errors: {message: 'No existe un usuario con ese id'}
                    });
                }

                var oldPath = './uploads/usuarios/' + usuario.img;
               
                // si existe, borra la imagen
                if ( fs.existsSync(oldPath) ) {
                    fs.unlink( oldPath, (err) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'No se reemplazar la imagen!',
                                errors: err
                            });
                        }
                    });
                }

                usuario.img = nombreArchivo;

                usuario.save( (err, usuarioActualizado) => {
                    // si hay un error, regreso el response
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar usuario!',
                            errors: err
                        });
                    }

                    usuarioActualizado.password = ':)';
                    
                    return res.status(200).json({
                        ok:true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    })
                });

            });
        break;
        
        case 'medicos':

            Medicos.findById( id , (err, medico) => {

                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Ocurrio un error al obtener el medico',
                        errors: err
                    });
                }

                if( !medico ) {
                    return res.status(401).json({
                        ok:false,
                        mensaje: 'No existe el medico con ese id' + id,
                        errors: {message: 'No existe un medico con ese id'}
                    });
                }

                var oldPath = './uploads/medicos/' + medico.img;
            
                // si existe, borra la imagen
                if ( fs.existsSync(oldPath) ) {
                    fs.unlink( oldPath, (err) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'No se reemplazar la imagen!',
                                errors: err
                            });
                        }
                    });
                }

                medico.img = nombreArchivo;

                medico.save( (err, medicoActualizado) => {
                    // si hay un error, regreso el response
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar medico!',
                            errors: err
                        });
                    }

                    return res.status(200).json({
                        ok:true,
                        mensaje: 'Imagen de medico actualizada',
                        medico: medicoActualizado
                    })
                });

            });


        break;
        
        case 'hospitales':

            Hospital.findById( id , (err, hospital) => {

                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Ocurrio un error al obtener el hospital',
                        errors: err
                    });
                }

                if( !hospital ) {
                    return res.status(401).json({
                        ok:false,
                        mensaje: 'No existe el hospital con ese id' + id,
                        errors: {message: 'No existe un hospital con ese id'}
                    });
                }

                var oldPath = './uploads/hospitales/' + hospital.img;
            
                // si existe, borra la imagen
                if ( fs.existsSync(oldPath) ) {
                    fs.unlink( oldPath, (err) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'No se reemplazar la imagen!',
                                errors: err
                            });
                        }
                    });
                }

                hospital.img = nombreArchivo;

                hospital.save( (err, hospitalActualizado) => {
                    // si hay un error, regreso el response
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar hospital!',
                            errors: err
                        });
                    }

                    return res.status(200).json({
                        ok:true,
                        mensaje: 'Imagen de hospital actualizada',
                        hospital: hospitalActualizado
                    })
                });

            });
            
        break;
    }
}

// con esto digo que se va a exportar el app para usar fuera del archivo
module.exports = app;