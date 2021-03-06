const fs = require('fs');

const data = JSON.parse(fs.readFileSync('register.json'));

const findUser = function(username){
    const user = data.register.find(a => a.username === username);
    return user.username;
}

const getPassword = function(username) {
    for(let i in data.register){
        if(data.register[i].username == username){
            return data.register[i].password;
        }
    }
}

const saveSessionId = function(username){
    for(let i in data.register){
        if(data.register[i].username == username){
            //const sessionId = Math.random();
            data.register[i].sessionId = username;
            fs.writeFileSync('register.json', JSON.stringify(data));
            return username;
        }
    }
}

module.exports = {findUser, getPassword, saveSessionId};