const textarea = document.querySelector('textarea');
const button = document.querySelector('button');
const chat = document.querySelector('#chat');

const addComment = (value) => {
    var comment = document.createTextNode(value);
    chat.append(comment);
    console.log('git test');
}

button.addEventListener('click', () =>{
    addComment(textarea.value);
});