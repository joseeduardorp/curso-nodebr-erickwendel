/*
  Exemplificando o cíclo de vida do NodeJS

  0 - Obter um usuário
  1 - Obter o número de telefone do usuário a partir do seu ID
  2 - Obter o endereço do usuário a partir do seu ID
*/

// importa o módulo interno 'util' do node.js
const util = require('util');

// transforma a função obterEndereco (com padrão 'callback') em uma Promise
const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario() {
	return new Promise((resolve, reject) => {
		// retorna um erro na Promise
		// reject(new Error('Só um sustinho :)'));

		setTimeout(() => {
			return resolve({
				id: 1,
				nome: 'Henry Dorsett Case',
				dataNascimento: new Date(),
			});
		}, 1000);
	});
}

function obterTelefone(idUsuario) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			return resolve({
				idUsuario,
				telefone: '988776655',
				ddd: 12,
			});
		}, 2000);
	});
}

function obterEndereco(idUsuario, callback) {
	setTimeout(() => {
		return callback(null, {
			idUsuario,
			rua: 'Jules Verne',
			numero: 1000,
		});
	}, 2000);
}

const usuarioPromise = obterUsuario();

usuarioPromise
	.then((usuario) => {
		// aqui pega os dados de 'usuario' e mescla com os dados da promise 'obterTelefone'
		// e retorna os dados 'formatados' que serão passados para o próximo '.then'

		return obterTelefone(usuario.id).then((resultado) => ({
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
			},
			telefone: resultado,
		}));
	})
	.then((resultadoAnterior) => {
		// aqui pega o resultado da função assincrona 'obterEnderecoAsync'
		// e retorna os dados 'formatados' que serão passados para o próximo '.then'

		const endereco = obterEnderecoAsync(resultadoAnterior.usuario.id);

		return endereco.then((resultadoEndereco) => ({
			usuario: resultadoAnterior.usuario,
			telefone: resultadoAnterior.telefone,
			endereco: resultadoEndereco,
		}));
	})
	.then((resultado) => {
		// aqui só mostra o resultado

		console.log(`
      Nome: ${resultado.usuario.nome}
      Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
      Endereço: Rua ${resultado.endereco.rua}, ${resultado.endereco.numero}
    `);
	})
	.catch((erro) => {
		console.error('Houve um erro', erro);
	});
