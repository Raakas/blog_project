const textarea = document.querySelector('textarea');
const button = document.querySelector('button');
const chat = document.querySelector('#chat');

const addComment = (value) => {
    var comment = document.createTextNode(value);
    chat.append(comment);
}

button.addEventListener('click', () =>{
    addComment(textarea.value);
});