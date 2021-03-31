let sockets = [];

exports.getSocketInfo = (socketId) => {
    console.log(sockets);
    console.log(`Requested socket id : ${socketId}`);
    return sockets.find(s => s.socketId === socketId);
}

exports.addNewSocketConnection = (socketId, username) => {
    if (!this.getSocketInfo(socketId)) {
        const socketInfo = {
            socketId: socketId,
            username: username
        }
        sockets.push(socketInfo);
    }
}