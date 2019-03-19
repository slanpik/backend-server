// importaciones
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/** @var hospitalSchema es el modelo del hospital */
var hospitalSchema = new Schema({
    /** @var nombre es el nombre del hospital */
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    
    /** @var img es la imagen del hospital */
    img: { type: String, required: false },

    /** @var usuario es el usuario que creo el hospital */
    usuario: {	type: Schema.Types.ObjectId, ref: 'Usuario' }
}, 
    // La collecion es para que cree la base de datos con el nombre que yo le doy,
    // esto simplemente es	para evitar	que	Mongoose coloque el	nombre a la	colección como 'hospitals'
    { collection: 'hospitales' }); 


    // Se exporta el modelo para que se pueda usar.
    module.exports = mongoose.model('Hospital', hospitalSchema);