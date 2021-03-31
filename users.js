let users = []
let tokens = []

const uuidv4 = require('uuid').v4;

exports.userExists = (id) => {
    return users.find( u => u.id === id);
}

exports.connect = (username) => {
    const user = {
        id: uuidv4(),
        username: username
    }
    users.push(user);

    const token = uuidv4();
    tokens.push({
        token: token,
        userId: user.id
    });

    return {
        id: user.id,
        token: token
    }
}

exports.getUsernameFromToken = (token) => {
    let session = tokens.find(t => t.token === token);
    if (session) {
        return this.getUsernameFromId(session.userId);
    }
}

exports.getUsernameFromId = (userId) => {
    let user = users.find(u => u.id === userId);
    return user.username;
}