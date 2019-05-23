const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const functions = require('./functions');
const PORT = 5000;

app.use(session({
    name: "cookieNameHere",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    secret: "aSecretString",
    cookie: {
        secure: false,
        maxAge: 1000 * 120,
        sameSite: true,
    }
}));
 
app.use('/', express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}) );
app.use(bodyParser.json());

const auth = (request, response, next) => {

    if(request.session.userId === 1){
        next();
    }
    else {
        response.send('you are not authorized');
    }
}

app.get('/login', auth, (request, response) => {
    console.log('logged in');
    response.render('user.ejs');
});

app.get('/logout', (request, response) => {

    req.session.destroy(err => {
        if (err) {
            response.redirect("/");
        } else {
            response.clearCookie("cookieNameHere");
            response.redirect("/");
        }
    });

});

app.get('/', (request, response) => {

    console.log(request.session);

    const path = 'blogs.json';

    try {
        if (!fs.existsSync(path)) {
            const json = {"blogs":[]};
            const data = JSON.stringify(json);
            fs.writeFileSync('blogs.json', data);
        }
    }
    catch(err) {
        console.error(err)
    }

    const data = fs.readFileSync('blogs.json');
    const blogs = JSON.parse(data);
    
    response.render('index.ejs', blogs);

});

app.post('/', (request, response) => {
    
    const {username, password} = request.body;

    if(functions.findUser(username)){

        let hash = functions.getPassword(username);
        
        bcrypt.compare(password, hash)
        .then(res => {
            if(res){
                request.session.userId = 1;
                response.redirect('/login');
            }
            else {
                console.log('wrong password');
                response.redirect('/');
            }
        })
        .catch(err => console.error(err.message));

    }
    else {
        console.log('wrong username');
        response.redirect('/');
    }
});

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

    const chat = JSON.parse(fs.readFileSync('chat.json'));

    response.render('blog.ejs', chat);
});

app.post('/blog', (request, response) => {

    data = JSON.parse(fs.readFileSync('chat.json'));
    data.chat.push({"name": request.body.name, "comment": request.body.comment});
    const json = JSON.stringify(data);

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
   
    data = JSON.parse(fs.readFileSync('register.json'));

    const password = request.body.password;
    const saltRounds = 10;

    bcrypt
    .genSalt(saltRounds)
    .then(salt => {
        return bcrypt.hash(password, salt);
    })
    .then(hash => {
        data.register.push({"username": request.body.username, "password": hash});
        const json = JSON.stringify(data);

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