const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use('/', express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}) );
app.use(bodyParser.json());

app.get('/', (request, response) => {
    
    response.render('index.ejs', data);
    //response.sendFile(__dirname + '/index.ejs');

});

app.get('/blog', (request, response) => {

    const data = fs.readFileSync('chat.json');
    const chat = JSON.parse(data);
    console.log(chat);

    response.render('blog.ejs', chat);

    //response.sendFile(__dirname + '/blog.html');
});

app.post('/blog', (request, response) => {

    data = fs.readFileSync('chat.json')
    let obj = JSON.parse(data);
    obj.chat.push({"name": request.body.name, "comment": request.body.comment});
    const json = JSON.stringify(obj);

    fs.writeFileSync('chat.json', json, {flags: 'a'}, (err) => {
        if(err){
            console.log(err);
        }
    });

    response.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});