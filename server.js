const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use('/', express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}) );
app.use(bodyParser.json());

app.get('/', (request, response) => {

    const data = fs.readFileSync('blogs.json');
    const blogs = JSON.parse(data);
    
    response.render('index.ejs', blogs);

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
    obj.register.push({"username": request.body.username, "password": request.body.password});
    const json = JSON.stringify(obj);

    fs.writeFileSync('register.json', json, (err) => {
        if(err){
            console.log(err);
        }
    });

    response.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});