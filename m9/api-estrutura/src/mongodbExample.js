// npm i mongoose
const Mongoose = require('mongoose');

Mongoose.connect(
	'mongodb://joseeduardo:minhasenha@localhost:27017/heroes'
).catch((err) => {
	console.error('Falha na conexão!', err);
});

const connection = Mongoose.connection;
connection.once('open', () => console.log('Conectado com sucesso!'));

/*
  Estados  de conexão:
  0 = disconnected
  1 = connected
  2 = connecting
  3 = disconnecting
  
  setTimeout(() => {
    const state = connection.readyState;
    console.log('state', state);
  }, 1000);
*/

const heroiSchema = new Mongoose.Schema({
	nome: {
		type: String,
		required: true,
	},
	poder: {
		type: String,
		required: true,
	},
	insertedAt: {
		type: Date,
		default: new Date(),
	},
});

const model = Mongoose.model('herois', heroiSchema);

async function main() {
	const resultCadastrar = await model.create({
		nome: 'Batman',
		poder: 'Dinheiro',
	});
	console.log('result cadastrar', resultCadastrar);

	const listarItens = await model.find();
	console.log('itens listados', listarItens);
}

main();
