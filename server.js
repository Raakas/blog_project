const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use('/', express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}) );
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');

});

app.get('/blog', (request, response) => {

    fs.readFileSync('chat.json', request, (err) => {
        if(err){
            console.log(err);
        }
    });

    response.sendFile(__dirname + '/blog.html');
});

app.post('/blog', (request, response) => {

    fs.writeFileSync('chat.json', request.body.comment, {flag: "a"}, (err) => {
        if(err){
            console.log(err);
        }
    });
    
    response.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});