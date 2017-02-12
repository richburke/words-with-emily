const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const debug = require('debug')('server');

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/views/index.html');
});

debug('server initialized', process.cwd(), process.arch);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });

  socket.on('tray', (msg) {
    console.log('tray: ' + msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
