const fs = require('fs');

const findUser = function(username){
    const data = JSON.parse(fs.readFileSync('register.json'));
    const u = data.register.find(user => user.username === username);
    return u;
}

const getPassword = function(username) {
    const data = JSON.parse(fs.readFileSync('register.json'));

    for(let i in data.register){
        if(data.register[i].username == username){
            return data.register[i].password;
        }
    }
}

module.exports = {findUser, getPassword};