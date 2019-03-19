var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({

     /** @var nombre es el nombre del hospital */
     nombre: { type: String, required: [true, 'El nombre es necesario'] },    

     /** @var img es la imagen del hospital */
     img: { type: String, required: false }, 

     /** @var usuario es el usuario que creo el hospital */
     usuario: {	type: Schema.Types.ObjectId, ref: 'Usuario' },

     /** @var hospital es el hospital al que pertenece el medico */
     hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio']}

}, { collection: 'medicos' });

module.exports = mongoose.model('Medico', medicoSchema);
