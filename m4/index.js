const { program } = require('commander');

const db = require('./database');
const Heroi = require('./heroi');

async function main() {
	program
		.version('v1')
		.option('-n, --nome [value]', 'Nome do herói')
		.option('-p, --poder [value]', 'Poder do herói')
		.option('-i, --id [value]', 'ID do herói')

		.option('-c, --cadastrar', 'Cadastrar um herói')
		.option('-l, --listar', 'Listar um herói')
		.option('-a, --atualizar [value]', 'Atualizar um herói')
		.option('-r, --remover', 'Remover um herói')
		.parse(process.argv);

	program.parse();
	const options = program.opts();

	const heroi = new Heroi(options);

	try {
		if (options.cadastrar) {
			delete heroi.id;

			const resultado = await db.cadastrar(heroi);

			if (!resultado) {
				console.error('Não foi possível cadastrar o herói');
				return;
			}

			console.log('Herói cadastrado com sucesso');
		}

		if (options.listar) {
			const resultado = await db.listar();
			console.log(resultado);

			return;
		}

		if (options.atualizar) {
			const idParaAtualizar = parseInt(options.atualizar);

			const dados = JSON.stringify(heroi);
			const novosDados = JSON.parse(dados);

			const resultado = await db.atualizar(idParaAtualizar, novosDados);

			if (!resultado) {
				console.error('Não foi possível atualizar o herói');
				return;
			}

			console.log('Herói atualizado com sucesso');
		}

		if (options.remover) {
			const resultado = await db.remover(heroi.id);

			if (!resultado) {
				console.error('Não foi possível remover o herói');
				return;
			}
			console.error('Herói removido com sucesso');
		}
	} catch (error) {
		console.error('Houve um erro interno', error);
	}
}

main();
