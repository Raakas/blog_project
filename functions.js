const fs = require('fs');

const data = JSON.parse(fs.readFileSync('register.json'));

const findUser = function(username){
    const user = data.register.find(a => a.username === username);
    return user;
}

const saveUserId = function(username, value){
    for(let i in data.register){
        if(data.register[i].username == username){
            data.register[i].userId = value;
            fs.writeFileSync('register.json', JSON.stringify(data));
        }
    }
}

const getPassword = function(username) {
    for(let i in data.register){
        if(data.register[i].username == username){
            return data.register[i].password;
        }
    }
}

module.exports = {findUser, getPassword, saveUserId};