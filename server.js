const mongodb = require('mongodb').MongoClient;
const url = 'localhost:27017';
const DB = 'blogProject';
const userPwd = 'admin:admin';

mongodb.connect(`mongodb://${userPwd}@${url}/${DB}`,{ useNewUrlParser: true },(err,db) => {
   if (err) throw err;
   db.db(DB).collection("blogs").findOne({},(err,res) => {
       if (err) throw err;
       console.log(res);
       db.close();
   });
});

const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const functions = require('./functions');
const PORT = 5000;

app.use(session({
    name: "loginStatus",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    secret: "f334#%Ahs5h4a%HS%H",
    cookie: {
        secure: false,
        maxAge: 1000 * 30,
        sameSite: true,
    }
}));
 
app.use('/', express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}) );
app.use(bodyParser.json());

const auth = (request, response, next) => {

    if(request.session.sessionId){

        //const user = functions.findUser(request.session.sessionId);

        mongodb.connect(`mongodb://${userPwd}@${url}/${DB}`,{ useNewUrlParser: true },(err,db) => {
            if (err) throw err;
            db.db(DB).collection("blogs").findOne({},(err,res) => {
                if (err) throw err;

                console.log(res);
                db.close();
            });
        });


        if(1 === 1){
            next();
        }
        else {
            console.log('session expired');
            response.redirect('/');
        }
        
    }
    else {
        console.log('no session');
        response.redirect('/');
    }
}

app.get('/login', auth, (request, response) => {
    response.render('user.ejs');
});

app.get('/logout', (request, response) => {

    req.session.destroy(err => {
        if (err) {
            response.redirect("/");
        } else {
            response.clearCookie("loginStatus");
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

    if(1===1){

        let hash = functions.getPassword(username);
        
        bcrypt.compare(password, hash)
        .then(res => {
            if(res){
                request.session.sessionId = functions.saveSessionId(username);
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

app.get('/blog', auth, (request, response) => {
    
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

    const {username, password} = request.body;

    if(1===1){
        
        const saltRounds = 10;
        bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(password, salt);
        })
        .then(hash => {

            mongodb.connect(`mongodb://${userPwd}@${url}/${DB}`,{ useNewUrlParser: true },(err,db) => {
                const user = { "username": username, "password": hash };
                db.db(DB).collection("blogs").insertOne(user, function(err, res) {
                    if (err) throw err;
                    console.log("1 user inserted");
                    db.close();
                });
            });

            request.session.sessionId = request.body.username;
 
            response.redirect('/login');

        })
        .catch(err => console.error(err.message));
    } else {
        console.log('username taken');
        response.redirect('/register');
    }
});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});