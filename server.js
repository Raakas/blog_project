const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const PORT = 5000;
const saltRounds = 10;

app.use('/', express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}) );
app.use(bodyParser.json());

app.get('/', (request, response) => {

    const data = fs.readFileSync('blogs.json');
    const blogs = JSON.parse(data);
    
    response.render('index.ejs', blogs);

});

app.post('/', (request, response) => {
    
    const username = request.body.username;
    const password = request.body.password;

    const db = fs.readFileSync('register.json');
    const data = JSON.parse(db);

    const hash = data.register[6].password;

    bcrypt
        .compare(password, hash)
        .then(res => {
            console.log(res);
            response.redirect('/blog');
        })
        .catch(err => console.error(err.message));

})

app.get('/blog', (request, response) => {

    const path = 'chat.json'

    try {
        if (!fs.existsSync(path)) {
            const json = {"chat":[]};
            const data = JSON.stringify(json);
            fs.writeFileSync('chat.json', data);
        }
    }
    catch(err) {
        console.error(err)
    }

    const data = fs.readFileSync('chat.json');
    const chat = JSON.parse(data);

    response.render('blog.ejs', chat);
});

app.post('/blog', (request, response) => {

    data = fs.readFileSync('chat.json');
    let obj = JSON.parse(data);
    obj.chat.push({"name": request.body.name, "comment": request.body.comment});
    const json = JSON.stringify(obj);

    fs.writeFileSync('chat.json', json, {flags: 'a'}, (err) => {
        if(err){
            console.log(err);
        }
    });

    response.redirect('/blog');
});

app.get('/register', (request, response) => {

    const path = 'register.json'

    try {
        if (!fs.existsSync(path)) {
            const json = {"register":[]};
            const data = JSON.stringify(json);
            fs.writeFileSync('register.json', data);
        }
    }
    catch(err) {
        console.error(err)
    }

    response.render('register.ejs');
})

app.post('/register', (request, response) => {
   
    data = fs.readFileSync('register.json');
    let obj = JSON.parse(data);

    const password = request.body.password;
    const saltRounds = 10;

    bcrypt
    .genSalt(saltRounds)
    .then(salt => {
        console.log(`Salt: ${salt}`);

        return bcrypt.hash(password, salt);
    })
    .then(hash => {
        console.log(`Hash: ${hash}`);

        obj.register.push({"username": request.body.username, "password": hash});
        const json = JSON.stringify(obj);

        fs.writeFileSync('register.json', json, (err) => {
            if(err){
                console.log(err);
            }
        });
    })
    .catch(err => console.error(err.message));

    response.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});