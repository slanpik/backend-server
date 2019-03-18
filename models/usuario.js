var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// con esto se controlan los roles validos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

// Siempre va el nombre de la coleccion en singular seguido por la pabla Schema
var usuarioSchema = new Schema({

    // Recibe un objeto tipo js. que sera cada uno de los campos usados
    
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }, // el enum es para decir la numeracion o en nuestro caso los roles validos

});

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'} );

module.exports = mongoose.model('Usuario', usuarioSchema);