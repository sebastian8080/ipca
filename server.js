const express = require('express');
var app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http, {
    log: false,
    origins: '*:*',
});

const five = require('johnny-five');
const path = require('path');
const router = express.Router();

const port = process.env.PORT || 3000;

var board = new five.Board();
var boton1, boton2;
var placaCargada = false;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET");
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