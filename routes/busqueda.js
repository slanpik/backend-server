// importaciones
var express = require('express');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// declaraciones
var app = express();

/**
 *========================
 * Buscar todos los datos
 *========================
 */
app.get('/todo/:busqueda', ( req, res, next ) => {

    // es la información que se va a buscar
    var busqueda = req.params.busqueda;

    // creamos una expresion regualar para buscar en mayusculas y minusculas
    var regex = new RegExp( busqueda, 'i');

    Promise.all([ 
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios( busqueda, regex ) ])
        .then( respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

    /**
     * Funcion para crear un proceso asincrono para buscar el elemento en la tabla de Hospitales
     * @param {*} busqueda es lo que se va a buscar 
     * @param {*} regex es la expresion regular que generamos
     */
    function buscarHospitales( busqueda, regex ) {
        
        // Generamos una promesa para obtener la información de la tabla Hospitales
        return new Promise( (resolve, reject ) => {
            
            Hospital.find({ nombre: regex })
                    .populate('usuario', 'nombre email')
                    .exec( (err, hospitales) => { 
                
                        if ( err ) {
                            reject(' Error al cargar hospitales', err);
                        } else {
                            resolve( hospitales);
                        }
                    });
                });

    }

    /**
     * Funcion para crear un proceso asincrono para buscar el elemento en la tabla de Medicos
     * @param {*} busqueda es lo que se va a buscar 
     * @param {*} regex es la expresion regular que generamos
     */
    function buscarMedicos( busqueda, regex ) {
        
        // Generamos una promesa para obtener la información de la tabla Medicos
        return new Promise( (resolve, reject ) => {
            
            Medico.find({ nombre: regex })
                  // para llenar el query      
                  .populate('usuario', 'nombre email')
                  .populate('hospital')
                  // execute para ejecutar el query
                  .exec( (err, medicos) => { 
                        // si hay un error devuelvo el reject
                        if ( err ) {
                            reject(' Error al cargar medicos', err);
                        } else {
                            // en caso que no haya error devuelvo los medicos
                            resolve( medicos );
                        }
                    });
        });

    }

    /**
     * Funcion para crear un proceso asincrono para buscar el elemento en la tabla de usuarios
     * @param {*} busqueda es lo que se va a buscar 
     * @param {*} regex es la expresion regular que generamos
     */
    function buscarUsuarios( busqueda, regex ) {
        
        // Generamos una promesa para obtener la información de la tabla usuarios
        return new Promise( (resolve, reject ) => {
            
            Usuario.find({}, 'nombre email role')
                    .or([ { 'nombre': regex }, { 'email': regex } ])
                    .exec( (err, usuarios ) => {

                if ( err ) {
                    // si hay un error devuelvo el reject
                    reject(' Error al cargar usuarios', err);
                } else {
                    // en caso que no haya error devuelvo los medicos
                    resolve( usuarios );
                }

            });
        });

    }


/**
 *========================
 * Busqueda por coleccion
 *========================
 */
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    
    var regexbusqueda = new RegExp(busqueda, 'i');

    var promesa;

    switch( tabla ) {
        
        case 'usuarios':
            promesa = buscarUsuarios( busqueda, regexbusqueda);
        break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regexbusqueda);
        break;
        
        case 'hospitales':
            promesa =buscarHospitales(busqueda, regexbusqueda);
        break;
        
        default: 
            return res.status(400).json({
                ok: false,
                mensajes: ' Los tipos de busqueda solo son: usuarios, medicos, hospitales',
                error: { message: ' Tipo de tabla/ coleccion no valido'}
            });
    }

    promesa.then( data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});
 
// con esto digo que se va a exportar el app para usar fuera del archivo
module.exports = app;