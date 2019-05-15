const fs = require('fs');

const textarea = document.querySelector('textarea');
const button = document.querySelector('button');
const chat = document.querySelector('#chat');

const addComment = (value) => {
    fs.writeFileSync('chat.json', value, (err) => {
        if(err){console.log(err);}
    });
}

button.addEventListener('click', () =>{
    addComment(textarea.value);
});