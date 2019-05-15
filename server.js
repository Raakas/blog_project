const express = require('express');
const app = express();
const PORT = 5000;

app.use('/', express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.sendfile(__dirname + '/index.html');
});

app.get('/blog', (request, response) => {
    response.sendfile(__dirname + '/blog.html');
});

app.post('/blog', (request, response) => {
    response.redirect('/blog');
});

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});