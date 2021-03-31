const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const users = require('./users');
const socketIo = require('socket.io');
const mysockets = require('./mysockets');
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || "localhost";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }});

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/room", (req, res) => {
    const token = req.cookies.user_token;
    let username = users.getUsernameFromToken(token);
    if (username) {
        return res.render('room', { username: username, port: PORT, host: HOST });
    }
    return res.redirect('/');
});

app.get("/redirect", (req, res) => {
    return res.redirect('/room');
});

app.post('/connect', (req, res) => {
    const username = req.body.username;
    let userinfo = users.connect(username);
    if (userinfo) {
        return res.status(200).json(userinfo.token);
    }
    else {
        return res.status(401).send("The login information provided is not valid");
    }

})

io.on("connection", (socket) => {
    socket.on('connection_message', (username) => {
        console.log(`Received connection from user '${username}'`);
        mysockets.addNewSocketConnection(socket.id, username);
        socket.broadcast.emit('server_message', { message : `Welcome ${username} to the room!` });
    });
    socket.on('chat_message', (user, message) => {
        console.log(`Received new message from ${user} : ${message}`);
        socket.broadcast.emit('chat_message', {user: user, message : message });
    });
    socket.on('disconnecting', () => {
        const username = mysockets.getSocketInfo(socket.id).username;
        console.log(`${username} disconnected`);
        socket.broadcast.emit('server_message', {user: username, message : `${username} disconnected :(` });
    });
});

server.listen(PORT, () => console.log(`Server launched on port ${PORT}`));
