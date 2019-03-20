// Requires, importacion de librerias de terceros o propias
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables, es importante xq aqui donde usamos las librerias
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json())

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var imgRoutes = require('./routes/imagenes');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if( err ) throw err;

    console.log('base de datos 27017: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
 app.use('/login', loginRoutes); 
 app.use('/hospital', hospitalRoutes); 
 app.use('/busqueda', busquedaRoutes); 
 app.use('/medico', medicoRoutes); 
 app.use('/usuario', usuarioRoutes); 
 app.use('/upload', uploadRoutes); 
 app.use('/img', imgRoutes); 
 app.use('/', appRoutes); // Se usa un pequeño middleware para hacer funcionar la ruta


// Escuchar peticiones
// el 3000 es el puerto donde se va a escuchar las peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');

});

// Para correr el servidor de mongoDB
// "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\data\db" 

