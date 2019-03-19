/**
 * =============================
 * Verificar Token (middleware)
 * =============================
 */

 var jwt = require('jsonwebtoken');

// Se parametriza el seed para que sea mas facil de usar
var SEED = require('../config/config').SEED;


 /**
  * VerificaToken es una funcion para verificar el token enviado por el usuario para realizar la peticion
  * @param req es el request de la pagina contiene informacion del usuario
  * @param res es la respuesta que se va a ejecutar
  * @param next es una referencia para el control de flujo del codigo, donde una referencia a la siguiente función a ejecutar se le da a una devolución de llamada para que comience cuando esté terminada.
  */
exports.verificaToken = function( req, res, next ) {
    
    // el token lo capturamos del url
    var token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded ) => {
        
        if(err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        
        next();
        
    });
}
