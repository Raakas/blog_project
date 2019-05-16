
const textarea = document.querySelector('textarea');
const button = document.querySelector('button');
const chat = document.querySelector('#chat');

button.addEventListener('click', () => {
    addComment(textarea.value);
    textarea.value = "";
});