import './style.css';

console.log("Hello World!");

let content = document.querySelector("#content");

let div = document.createElement('div');
div.classList.add('test');

div.innerText = 'hello world!';

content.appendChild(div);
