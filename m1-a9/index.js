const EventEmitter = require('events');

class MeuEmissor extends EventEmitter {}

const meuEmissor = new MeuEmissor();
const nomeEvento = 'usuario:click';

meuEmissor.on(nomeEvento, (click) => {
	console.log('O usuário clicou ', click);
});

// meuEmissor.emit(nomeEvento, 'no botão de desligar');
// meuEmissor.emit(nomeEvento, 'na barra de pesquisa');

// let count = 0;
// setInterval(() => {
// 	meuEmissor.emit(nomeEvento, `${count++} vezes no botão`);
// }, 1000);

const stdin = process.openStdin();
stdin.addListener('data', (value) => {
	console.log(`Você digitou: ${value.toString().trim()}`);
});
