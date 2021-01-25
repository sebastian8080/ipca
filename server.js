const express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http, {
    origins: allowedOrigins,
    path: path
});

const five = require('johnny-five');
const path = require('path');
const router = express.Router();

var allowedOrigins = 'http://localhost:* http://127.0.0.1:*';
var path = '/stomp';

const port = process.env.PORT || 3000;

var board = new five.Board();
var boton1, boton2;
var placaCargada = false;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

comprobarPlaca(placaCargada);

board.on('ready', function(){
    var botonPresionado;
    placaCargada = true;
    comprobarPlaca(placaCargada);

    //Configuraciones de los pulsadores
    boton1 = new five.Button({
        pin: 2,
        isPullup: true
    });

    boton2 = new five.Button({
        pin: 3,
        isPullup: true
    });

    boton1.on('down', function(){
        console.log('Boton1 presionado');
        botonPresionado = 1;
        io.emit('data', botonPresionado);
    });

    boton2.on('down', function(){
        console.log('Boton2 presionado');
        botonPresionado = 2;
        io.emit('data', botonPresionado);
    });

});

router.get('/', (req, res) => {
    res.render('index');
});

app.use(router);

http.listen(port, function(){
    console.log('Server listening on port 3000!');
});

function comprobarPlaca(placa){
    if(placa){
        console.log('Placa cargada.');
    } else {
        console.log('Cargando Placa...');
    }
}