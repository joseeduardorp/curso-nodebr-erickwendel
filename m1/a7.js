/*
  Exemplificando o cíclo de vida do NodeJS

  0 - Obter um usuário
  1 - Obter o número de telefone do usuário a partir do seu ID
  2 - Obter o endereço do usuário a partir do seu ID
*/

// importa o módulo interno 'util' do node.js
const util = require('util');

// transforma a função obterEndereco (com padrão callback) em uma Promise
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

main();
async function main() {
	try {
		// calcula o tempo de execução de uma operação
		console.time('medida-promise');

		const usuario = await obterUsuario();
		// const telefone = await obterTelefone(usuario.id);
		// const endereco = await obterEnderecoAsync(usuario.id);

		const resultado = await Promise.all([
			obterTelefone(usuario.id),
			obterEnderecoAsync(usuario.id),
		]);

		const telefone = resultado[0];
		const endereco = resultado[1];

		console.log(`
      Nome: ${usuario.nome}
      Telefone: (${telefone.ddd}) ${telefone.telefone}
      Endereço: Rua ${endereco.rua}, ${endereco.numero}
    `);

		// exibe a duração da execução
		console.timeEnd('medida-promise');
	} catch (erro) {
		console.error('Houve um erro', erro);
	}
}
