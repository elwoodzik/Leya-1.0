import config from './config';
import path from 'path';

import express from 'express';
import homePage from './routes/home';

import io from 'socket.io';

import Game from './src_server/Game';

const server = express();

server.set('view engine', 'twig');

server.use('/', homePage);

//let a = new Game();


server.use(express.static('public'));

const sock_io = io.listen(server.listen(config.port, config.host, () => {
    console.info('Express listening on port', config.port);
}))

new Game(sock_io);
